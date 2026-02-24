import React, { useEffect, useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { getAllStudents } from '../../Api/students'
import { getLoginType, getUser } from '../../Api/auth'

const STORAGE_KEY = 'fees_opening_balance_migration_v1'

const REQUIRED_COLUMNS = [
  'Class',
  'Section',
  'Roll No',
  'Current Month Total',
  'Pending Due',
  'Advance',
]

const REQUIRED_COLUMN_MAP = {
  class: 'class',
  section: 'section',
  rollNo: 'rollno',
  currentMonthTotal: 'currentmonthtotal',
  pendingDue: 'pendingdue',
  advance: 'advance',
}

const normalizeText = (value) => String(value ?? '').trim()
const normalizeHeader = (value) => normalizeText(value).toLowerCase().replace(/[^a-z0-9]/g, '')
const normalizeClassValue = (value) => normalizeText(value).toUpperCase()
const normalizeSectionValue = (value) => normalizeText(value).toUpperCase()

const normalizeRollValue = (value) => {
  const raw = normalizeText(value)
  if (!raw) return ''
  if (/^\d+(\.0+)?$/.test(raw)) {
    return String(parseInt(raw, 10))
  }
  return raw.toUpperCase()
}

const parseAmount = (value) => {
  const raw = normalizeText(value).replace(/,/g, '')
  if (!raw) return null
  const numeric = Number(raw)
  return Number.isFinite(numeric) ? numeric : null
}

const formatAmount = (value) =>
  `Rs. ${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const formatDateTime = (isoString) => {
  if (!isoString) return '--'
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleString('en-IN')
}

function OpeningBalanceMigration() {
  const [migrationMonth, setMigrationMonth] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [uploadedRows, setUploadedRows] = useState([])
  const [parseError, setParseError] = useState('')

  const [students, setStudents] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [studentLoadError, setStudentLoadError] = useState('')

  const [isMigrating, setIsMigrating] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isConfirmedByAdmin, setIsConfirmedByAdmin] = useState(false)
  const [migrationReport, setMigrationReport] = useState(null)

  const user = getUser()
  const loginType = getLoginType()
  const isAdmin = loginType === 'all' && user?.role === 'admin'

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setMigrationReport(parsed)
      }
    } catch {
      setMigrationReport(null)
    }
  }, [])

  useEffect(() => {
    if (!isAdmin) return

    let mounted = true
    const run = async () => {
      setLoadingStudents(true)
      setStudentLoadError('')
      try {
        const response = await getAllStudents()
        const records = response?.students || response?.data || []
        if (mounted) {
          setStudents(Array.isArray(records) ? records : [])
        }
      } catch (error) {
        if (mounted) {
          setStudentLoadError(error?.message || 'Failed to load student master data for validation.')
          setStudents([])
        }
      } finally {
        if (mounted) {
          setLoadingStudents(false)
        }
      }
    }

    run()
    return () => {
      mounted = false
    }
  }, [isAdmin])

  const studentLookup = useMemo(() => {
    const classSet = new Set()
    const sectionSet = new Set()
    const rollSet = new Set()
    const classSectionMap = new Map()
    const studentKeySet = new Set()

    students.forEach((student) => {
      const classValue = normalizeClassValue(student?.class ?? student?.Class)
      const sectionValue = normalizeSectionValue(student?.section ?? student?.Section)
      const rollValue = normalizeRollValue(student?.roll_no ?? student?.rollNo ?? student?.Roll)

      if (classValue) classSet.add(classValue)
      if (sectionValue) sectionSet.add(sectionValue)
      if (rollValue) rollSet.add(rollValue)

      if (classValue && sectionValue) {
        if (!classSectionMap.has(classValue)) {
          classSectionMap.set(classValue, new Set())
        }
        classSectionMap.get(classValue).add(sectionValue)
      }

      if (classValue && sectionValue && rollValue) {
        studentKeySet.add(`${classValue}|${sectionValue}|${rollValue}`)
      }
    })

    return { classSet, sectionSet, rollSet, classSectionMap, studentKeySet }
  }, [students])

  const validationRows = useMemo(() => {
    if (!uploadedRows.length) return []

    const duplicateCounter = new Map()
    uploadedRows.forEach((row) => {
      const classValue = normalizeClassValue(row.class)
      const sectionValue = normalizeSectionValue(row.section)
      const rollValue = normalizeRollValue(row.rollNo)
      if (!classValue || !sectionValue || !rollValue) return
      const duplicateKey = `${classValue}|${sectionValue}|${rollValue}`
      duplicateCounter.set(duplicateKey, (duplicateCounter.get(duplicateKey) || 0) + 1)
    })

    return uploadedRows.map((row) => {
      const errors = []
      const classValue = normalizeClassValue(row.class)
      const sectionValue = normalizeSectionValue(row.section)
      const rollValue = normalizeRollValue(row.rollNo)
      const duplicateKey = classValue && sectionValue && rollValue ? `${classValue}|${sectionValue}|${rollValue}` : ''

      if (!classValue) {
        errors.push('Class is required.')
      } else if (!studentLookup.classSet.has(classValue)) {
        errors.push('Class does not exist.')
      }

      if (!sectionValue) {
        errors.push('Section is required.')
      } else {
        const sectionSetForClass = studentLookup.classSectionMap.get(classValue)
        const sectionExists = sectionSetForClass
          ? sectionSetForClass.has(sectionValue)
          : studentLookup.sectionSet.has(sectionValue)

        if (!sectionExists) {
          errors.push('Section does not exist.')
        }
      }

      if (!rollValue) {
        errors.push('Roll No is required.')
      } else if (!studentLookup.rollSet.has(rollValue)) {
        errors.push('Roll does not exist.')
      }

      if (classValue && sectionValue && rollValue && !studentLookup.studentKeySet.has(`${classValue}|${sectionValue}|${rollValue}`)) {
        errors.push('Student match not found for Class + Section + Roll.')
      }

      if (duplicateKey && duplicateCounter.get(duplicateKey) > 1) {
        errors.push('Duplicate roll row found in uploaded file.')
      }

      const currentMonthTotal = parseAmount(row.currentMonthTotal)
      const pendingDue = parseAmount(row.pendingDue)
      const advance = parseAmount(row.advance)

      if (currentMonthTotal === null) {
        errors.push('Current Month Total must be a valid number.')
      } else if (currentMonthTotal < 0) {
        errors.push('Current Month Total cannot be negative.')
      }

      if (pendingDue === null) {
        errors.push('Pending Due must be a valid number.')
      } else if (pendingDue < 0) {
        errors.push('Pending Due cannot be negative.')
      }

      if (advance === null) {
        errors.push('Advance must be a valid number.')
      } else if (advance < 0) {
        errors.push('Advance cannot be negative.')
      }

      return {
        ...row,
        class: normalizeText(row.class),
        section: normalizeText(row.section),
        rollNo: normalizeText(row.rollNo),
        currentMonthTotal: currentMonthTotal ?? row.currentMonthTotal,
        pendingDue: pendingDue ?? row.pendingDue,
        advance: advance ?? row.advance,
        errors,
        isValid: errors.length === 0,
      }
    })
  }, [uploadedRows, studentLookup])

  const validRows = useMemo(() => validationRows.filter((row) => row.isValid), [validationRows])
  const invalidRows = useMemo(() => validationRows.filter((row) => !row.isValid), [validationRows])

  const totalPendingDue = useMemo(
    () => validRows.reduce((sum, row) => sum + (Number(row.pendingDue) || 0), 0),
    [validRows]
  )
  const totalAdvance = useMemo(
    () => validRows.reduce((sum, row) => sum + (Number(row.advance) || 0), 0),
    [validRows]
  )

  const canMigrate =
    !migrationReport &&
    migrationMonth &&
    validRows.length > 0 &&
    invalidRows.length === 0 &&
    !loadingStudents &&
    !studentLoadError &&
    !isMigrating

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setParseError('')
    setUploadedRows([])
    setUploadedFileName(file.name)

    try {
      const fileBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(fileBuffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames?.[0]

      if (!firstSheetName) {
        setParseError('No worksheet found in uploaded file.')
        return
      }

      const worksheet = workbook.Sheets[firstSheetName]
      const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

      if (!rawRows.length) {
        setParseError('Uploaded sheet is empty.')
        return
      }

      const headers = Object.keys(rawRows[0] || {})
      const headerLookup = headers.reduce((acc, header) => {
        acc[normalizeHeader(header)] = header
        return acc
      }, {})

      const missingColumns = Object.entries(REQUIRED_COLUMN_MAP)
        .filter(([, normalized]) => !headerLookup[normalized])
        .map(([field]) => {
          if (field === 'rollNo') return 'Roll No'
          if (field === 'currentMonthTotal') return 'Current Month Total'
          if (field === 'pendingDue') return 'Pending Due'
          if (field === 'advance') return 'Advance'
          return field.charAt(0).toUpperCase() + field.slice(1)
        })

      if (missingColumns.length > 0) {
        setParseError(`Missing required columns: ${missingColumns.join(', ')}`)
        return
      }

      const normalizedRows = rawRows.map((row, index) => ({
        rowNumber: index + 2,
        class: row[headerLookup[REQUIRED_COLUMN_MAP.class]],
        section: row[headerLookup[REQUIRED_COLUMN_MAP.section]],
        rollNo: row[headerLookup[REQUIRED_COLUMN_MAP.rollNo]],
        currentMonthTotal: row[headerLookup[REQUIRED_COLUMN_MAP.currentMonthTotal]],
        pendingDue: row[headerLookup[REQUIRED_COLUMN_MAP.pendingDue]],
        advance: row[headerLookup[REQUIRED_COLUMN_MAP.advance]],
      }))

      setUploadedRows(normalizedRows)
    } catch (error) {
      setParseError(error?.message || 'Failed to parse uploaded file. Please upload a valid Excel file.')
    } finally {
      event.target.value = ''
    }
  }

  const handleConfirmMigration = async () => {
    if (!canMigrate || !isConfirmedByAdmin) return

    setIsMigrating(true)
    setParseError('')

    try {
      await new Promise((resolve) => setTimeout(resolve, 1800))

      const report = {
        month: migrationMonth,
        completedAt: new Date().toISOString(),
        uploadedFileName,
        totalStudents: validRows.length,
        totalPendingDue,
        totalAdvance,
        invalidRows: invalidRows.length,
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(report))
      setMigrationReport(report)
      setShowConfirmModal(false)
      setIsConfirmedByAdmin(false)
    } catch (error) {
      setParseError(error?.message || 'Migration failed. Please try again.')
    } finally {
      setIsMigrating(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Opening Balance Migration</h3>
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">Admin-only access</p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            You do not have permission to access Fees Migration Setup.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Migration Setup</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Opening Balance Migration for Fees module
          </p>
        </div>
        {migrationReport && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 text-xs font-bold">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Migration Locked
          </span>
        )}
      </div>

      <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined text-red-600 dark:text-red-400">warning</span>
          <div>
            <p className="text-sm font-bold text-red-700 dark:text-red-300">Migration can only be performed once.</p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Review the uploaded data carefully. Once completed, migration setup is permanently disabled.
            </p>
          </div>
        </div>
      </div>

      {migrationReport && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4 space-y-4">
          <p className="text-base font-black text-emerald-700 dark:text-emerald-300">
            Migration Completed for {migrationReport.month}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-700 bg-white/80 dark:bg-slate-800/60 p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Students</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{migrationReport.totalStudents}</p>
            </div>
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-700 bg-white/80 dark:bg-slate-800/60 p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Pending Due</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{formatAmount(migrationReport.totalPendingDue)}</p>
            </div>
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-700 bg-white/80 dark:bg-slate-800/60 p-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Advance</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{formatAmount(migrationReport.totalAdvance)}</p>
            </div>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-700 bg-white/80 dark:bg-slate-800/60 p-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">Completed At</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{formatDateTime(migrationReport.completedAt)}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              File: {migrationReport.uploadedFileName || '--'}
            </p>
          </div>
        </div>
      )}

      <div className={`${migrationReport ? 'opacity-60 pointer-events-none select-none' : ''} space-y-4`}>
        {/* Step 1 */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#137fec] text-white text-xs font-bold">1</span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Select Migration Month</h4>
          </div>
          <div className="max-w-sm">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Migration Month (YYYY-MM)</label>
            <input
              type="month"
              value={migrationMonth}
              onChange={(event) => setMigrationMonth(event.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
            />
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#137fec] text-white text-xs font-bold">2</span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Upload Excel</h4>
          </div>

          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Required Columns
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {REQUIRED_COLUMNS.map((column) => (
              <span
                key={column}
                className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 text-xs font-medium"
              >
                {column}
              </span>
            ))}
          </div>

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            disabled={!migrationMonth}
            className="block w-full text-sm text-slate-700 dark:text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-[#137fec] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#0f6dd4] disabled:opacity-60"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {migrationMonth
              ? 'Upload .xlsx or .xls file to continue.'
              : 'Select migration month first to enable upload.'}
          </p>
          {uploadedFileName && (
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
              File selected: <span className="font-semibold">{uploadedFileName}</span>
            </p>
          )}
        </div>

        {/* Step 3 */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#137fec] text-white text-xs font-bold">3</span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Preview and Validation</h4>
          </div>

          {loadingStudents && (
            <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-3 flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-blue-600 dark:text-blue-400">sync</span>
              <p className="text-sm text-blue-700 dark:text-blue-300">Loading student master data for validation...</p>
            </div>
          )}

          {studentLoadError && (
            <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3">
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">{studentLoadError}</p>
            </div>
          )}

          {parseError && (
            <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3">
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">{parseError}</p>
            </div>
          )}

          {validationRows.length > 0 && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Uploaded</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{validationRows.length}</p>
                </div>
                <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-3">
                  <p className="text-xs text-emerald-600 dark:text-emerald-300">Valid Records</p>
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-200">{validRows.length}</p>
                </div>
                <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3">
                  <p className="text-xs text-red-600 dark:text-red-300">Invalid Records</p>
                  <p className="text-lg font-bold text-red-700 dark:text-red-200">{invalidRows.length}</p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Pending Due</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{formatAmount(totalPendingDue)}</p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Advance</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{formatAmount(totalAdvance)}</p>
                </div>
              </div>

              {validRows.length > 0 && (
                <div className="rounded-lg border border-emerald-200 dark:border-emerald-700 overflow-hidden">
                  <div className="px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-700">
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Valid Records (Green)</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm">
                      <thead className="bg-emerald-100/70 dark:bg-emerald-900/30">
                        <tr>
                          <th className="px-3 py-2 text-left">#</th>
                          <th className="px-3 py-2 text-left">Class</th>
                          <th className="px-3 py-2 text-left">Section</th>
                          <th className="px-3 py-2 text-left">Roll No</th>
                          <th className="px-3 py-2 text-right">Current Month Total</th>
                          <th className="px-3 py-2 text-right">Pending Due</th>
                          <th className="px-3 py-2 text-right">Advance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {validRows.slice(0, 50).map((row) => (
                          <tr key={`valid-${row.rowNumber}`} className="border-b border-emerald-100 dark:border-emerald-900/30">
                            <td className="px-3 py-2">{row.rowNumber}</td>
                            <td className="px-3 py-2">{row.class}</td>
                            <td className="px-3 py-2">{row.section}</td>
                            <td className="px-3 py-2">{row.rollNo}</td>
                            <td className="px-3 py-2 text-right">{formatAmount(row.currentMonthTotal)}</td>
                            <td className="px-3 py-2 text-right">{formatAmount(row.pendingDue)}</td>
                            <td className="px-3 py-2 text-right">{formatAmount(row.advance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {validRows.length > 50 && (
                    <p className="px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
                      Showing first 50 rows out of {validRows.length} valid records.
                    </p>
                  )}
                </div>
              )}

              {invalidRows.length > 0 && (
                <div className="rounded-lg border border-red-200 dark:border-red-700 overflow-hidden">
                  <div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-700">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-300">Invalid Records (Red)</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm">
                      <thead className="bg-red-100/70 dark:bg-red-900/30">
                        <tr>
                          <th className="px-3 py-2 text-left">#</th>
                          <th className="px-3 py-2 text-left">Class</th>
                          <th className="px-3 py-2 text-left">Section</th>
                          <th className="px-3 py-2 text-left">Roll No</th>
                          <th className="px-3 py-2 text-left">Errors</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invalidRows.map((row) => (
                          <tr key={`invalid-${row.rowNumber}`} className="border-b border-red-100 dark:border-red-900/30">
                            <td className="px-3 py-2">{row.rowNumber}</td>
                            <td className="px-3 py-2">{row.class}</td>
                            <td className="px-3 py-2">{row.section}</td>
                            <td className="px-3 py-2">{row.rollNo}</td>
                            <td className="px-3 py-2 text-red-700 dark:text-red-300">
                              {row.errors.join(' ')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {uploadedRows.length === 0 && !parseError && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Upload file to preview valid and invalid rows.
            </p>
          )}
        </div>

        {/* Step 4 */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#137fec] text-white text-xs font-bold">4</span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Confirm Migration</h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Migration is allowed only when all rows are valid and no errors remain.
          </p>
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={!canMigrate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#137fec] text-white font-semibold hover:bg-[#0f6dd4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMigrating ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                Migrating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">send</span>
                Run Migration
              </>
            )}
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-5">
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Confirm Opening Balance Migration</h4>
            <div className="mt-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3">
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                This action is irreversible.
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Migration for {migrationMonth || '--'} will be finalized and cannot be run again.
              </p>
            </div>

            <label className="mt-4 flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isConfirmedByAdmin}
                onChange={(event) => setIsConfirmedByAdmin(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#137fec] focus:ring-[#137fec]"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                I confirm this migration is correct.
              </span>
            </label>

            <div className="mt-5 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false)
                  setIsConfirmedByAdmin(false)
                }}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                disabled={isMigrating}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmMigration}
                disabled={!isConfirmedByAdmin || isMigrating}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {isMigrating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                    Processing...
                  </>
                ) : (
                  'Confirm and Migrate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OpeningBalanceMigration

