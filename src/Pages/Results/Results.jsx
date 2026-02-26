import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { getStudentResultPublic } from '../../Api/marks'
import schoolLogo from '../../assets/logo.jpeg'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'
import '../../styles/print.css'

const SUMMARY_TERMINALS = ['First', 'Second', 'Third', 'Annual']
const TERMINAL_ALIAS_MAP = {
  first: 'First',
  second: 'Second',
  third: 'Third',
  annual: 'Annual',
  final: 'Annual',
}
const SUMMARY_REPORT_KEY_MAP = {
  First: 'first_term',
  Second: 'second_term',
  Third: 'third_term',
  Annual: 'annual_term',
}

const normalizeTerminalLabel = (value) => {
  const normalized = String(value || '').trim()
  if (!normalized) return ''
  return TERMINAL_ALIAS_MAP[normalized.toLowerCase()] || normalized
}

const getCumulativeTerminals = (terminalValue) => {
  const normalizedTerminal = normalizeTerminalLabel(terminalValue)
  if (!normalizedTerminal) return []

  const terminalIndex = SUMMARY_TERMINALS.indexOf(normalizedTerminal)
  if (terminalIndex === -1) return [normalizedTerminal]

  return SUMMARY_TERMINALS.slice(0, terminalIndex + 1)
}

const hasMeaningfulValue = (value) => {
  if (value === undefined || value === null) return false
  if (typeof value === 'string' && value.trim() === '') return false
  return true
}

const normalizeSummaryRow = (summaryRow) => {
  if (!summaryRow || typeof summaryRow !== 'object') return null

  const normalizedRank = (
    summaryRow?.rank ??
    summaryRow?.class_section_rank ??
    summaryRow?.section_rank ??
    summaryRow?.rank_in_section ??
    summaryRow?.classSectionRank ??
    summaryRow?.sectionRank ??
    summaryRow?.section_position ??
    null
  )

  const normalizedPublishedDate = (
    summaryRow?.published_date ??
    summaryRow?.publish_date ??
    summaryRow?.publishedDate ??
    summaryRow?.published_at ??
    summaryRow?.publishedAt ??
    summaryRow?.result_published_date ??
    null
  )

  return {
    ...summaryRow,
    rank: normalizedRank,
    published_date: normalizedPublishedDate,
  }
}

const mergeSummaryRows = (baseSummary, incomingSummary) => {
  const base = normalizeSummaryRow(baseSummary) || {}
  const incoming = normalizeSummaryRow(incomingSummary) || {}
  const merged = { ...base }

  Object.entries(incoming).forEach(([key, value]) => {
    if (hasMeaningfulValue(value)) {
      merged[key] = value
    } else if (!(key in merged)) {
      merged[key] = value
    }
  })

  return Object.keys(merged).length > 0 ? merged : null
}

const buildSummaryFromSummaryReport = (summaryReport, terminalLabel) => {
  const reportKey = SUMMARY_REPORT_KEY_MAP[terminalLabel]
  if (!reportKey || !summaryReport || typeof summaryReport !== 'object') return null

  const totalMarks = summaryReport?.total_marks?.[reportKey]
  const marksObtained = summaryReport?.marks_obtained?.[reportKey]
  const percentage = summaryReport?.percentage?.[reportKey]
  const division = summaryReport?.division?.[reportKey]
  const rank = summaryReport?.rank?.[reportKey]
  const publishedDate = summaryReport?.published_date?.[reportKey]

  const hasValue = [
    totalMarks,
    marksObtained,
    percentage,
    division,
    rank,
    publishedDate,
  ].some((value) => value !== undefined && value !== null && value !== '')

  if (!hasValue) return null

  return normalizeSummaryRow({
    total_max_marks: totalMarks ?? null,
    total_obtained: marksObtained ?? null,
    percentage: percentage ?? null,
    division: division ?? null,
    rank: rank ?? null,
    published_date: publishedDate ?? null,
  })
}

const getOrderedTerminalKeys = (keys = []) => {
  const uniqueKeys = [...new Set(keys.filter(Boolean))]
  const knownTerminals = SUMMARY_TERMINALS.filter((terminal) => uniqueKeys.includes(terminal))
  const customTerminals = uniqueKeys.filter((terminal) => !SUMMARY_TERMINALS.includes(terminal))
  return [...knownTerminals, ...customTerminals]
}

function Results() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'
  const SCHOOL_ADDRESS = import.meta.env.VITE_SCHOOL_ADDRESS || 'Bilaspur Dainmarwa Road, Harinagar (W. Champaran)'
  const cardRef = useRef(null)

  const [searchParams] = useSearchParams()

  const params = useMemo(() => {
    const classValue = searchParams.get('class') || ''
    const roll = searchParams.get('roll') || ''
    const terminal = searchParams.get('terminal') || ''
    const section = searchParams.get('section') || ''
    const session = searchParams.get('session') || ''
    return { classValue, roll, terminal, section, session }
  }, [searchParams])
  const { classValue, roll, terminal, section, session } = params

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [termSummaries, setTermSummaries] = useState({})
  const [visibleTerminals, setVisibleTerminals] = useState([])

  useEffect(() => {
    let isActive = true

    const run = async () => {
      setError('')

      if (!classValue || !roll || !terminal) {
        setData(null)
        setTermSummaries({})
        setVisibleTerminals([])
        setError('Missing params. Please go back and fill Class, Roll and Terminal.')
        return
      }

      setLoading(true)

      try {
        const selectedTerminal = normalizeTerminalLabel(terminal)
        const summaryTerminals = getCumulativeTerminals(selectedTerminal)

        const currentData = await getStudentResultPublic({
          classValue,
          roll,
          terminal: selectedTerminal || terminal,
          section,
          session,
        })
        if (!isActive) return

        if (!currentData) {
          setData(null)
          setTermSummaries({})
          setVisibleTerminals([])
          setError('Result for this terminal is not available or not published yet.')
          return
        }

        const currentTerminal = normalizeTerminalLabel(
          currentData?.resolved_terminal || currentData?.terminal || selectedTerminal || terminal
        )
        const nextSummaries = {}

        if (Array.isArray(currentData?.terminals)) {
          currentData.terminals.forEach((terminalRow) => {
            const terminalLabel = normalizeTerminalLabel(terminalRow?.terminal)
            if (!terminalLabel) return
            nextSummaries[terminalLabel] = normalizeSummaryRow(terminalRow?.summary)
          })
        }

        summaryTerminals.forEach((terminalLabel) => {
          if (nextSummaries[terminalLabel]) return
          const summaryFromReport = buildSummaryFromSummaryReport(currentData?.summary_report, terminalLabel)
          if (summaryFromReport) {
            nextSummaries[terminalLabel] = summaryFromReport
          }
        })

        if (currentTerminal) {
          const currentSummary = normalizeSummaryRow(currentData?.summary)
          if (currentSummary) {
            nextSummaries[currentTerminal] = mergeSummaryRows(nextSummaries[currentTerminal], currentSummary)
          } else if (!(currentTerminal in nextSummaries)) {
            nextSummaries[currentTerminal] = null
          }
        }

        const requestedTerminals = summaryTerminals.length > 0
          ? summaryTerminals
          : (currentTerminal ? [currentTerminal] : [])
        const fallbackTerminals = getOrderedTerminalKeys(Object.keys(nextSummaries))
        const nextVisibleTerminals = requestedTerminals.length > 0 ? requestedTerminals : fallbackTerminals
        const normalizedSummaries = nextVisibleTerminals.reduce((acc, terminalLabel) => {
          acc[terminalLabel] = nextSummaries[terminalLabel] || null
          return acc
        }, {})

        setData(currentData)
        setVisibleTerminals(nextVisibleTerminals)
        setTermSummaries(normalizedSummaries)

      } catch (err) {
        if (!isActive) return
        setData(null)
        setTermSummaries({})
        setVisibleTerminals([])
        setError(err?.data?.message || err?.message || 'Failed to fetch result')
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    run()

    return () => {
      isActive = false
    }
  }, [classValue, roll, terminal, section, session])

  const student = data?.student
  const marks = useMemo(() => (
    Array.isArray(data?.marks) ? data.marks : []
  ), [data?.marks])
  const summary = data?.summary

  const fireToast = (type, title, message) => {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { type, title, message } }))
  }

  const handlePrint = () => {
    if (!data) return

    try {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 8
      const contentWidth = pageWidth - margin * 2

      doc.setDrawColor(70, 94, 126)
      doc.setLineWidth(0.4)
      doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 4, 4)

      let y = margin + 8
      doc.setFont('times', 'bold')
      doc.setTextColor(31, 52, 96)
      doc.setFontSize(24)
      doc.text(String(SCHOOL_NAME).toUpperCase(), pageWidth / 2, y, { align: 'center' })
      y += 6

      doc.setFont('times', 'bold')
      doc.setTextColor(52, 74, 115)
      doc.setFontSize(10)
      doc.text(String(SCHOOL_ADDRESS).toUpperCase(), pageWidth / 2, y, { align: 'center' })
      y += 7

      doc.setTextColor(42, 63, 103)
      doc.setFontSize(13)
      doc.text(
        `${String(data?.terminal || params.terminal || '--').toUpperCase()} EXAMINATION RESULT - ${sessionLabel}`,
        pageWidth / 2,
        y,
        { align: 'center' }
      )
      y += 4

      doc.setDrawColor(194, 204, 221)
      doc.line(margin + 3, y, pageWidth - margin - 3, y)
      y += 3

      const infoBody = [
        [
          'Name of Student',
          toDisplayValue(student?.name),
          'Roll Number',
          toDisplayValue(student?.roll_no ?? params.roll),
        ],
        [
          "Father's Name",
          toDisplayValue(student?.father_name),
          'Section',
          toDisplayValue(student?.section ?? params.section),
        ],
        [
          'Class',
          toDisplayValue(student?.class ?? params.classValue),
          'Current Terminal',
          toDisplayValue(data?.terminal || params.terminal),
        ],
        [
          'Session',
          toDisplayValue(sessionLabel),
          '',
          '',
        ],
      ]

      autoTable(doc, {
        startY: y,
        margin: { left: margin + 3, right: margin + 3 },
        tableWidth: contentWidth - 6,
        theme: 'grid',
        body: infoBody,
        styles: { fontSize: 9, cellPadding: 2, textColor: [20, 28, 43] },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [238, 242, 248], cellWidth: 40 },
          1: { fontStyle: 'bold', cellWidth: 54 },
          2: { fontStyle: 'bold', fillColor: [238, 242, 248], cellWidth: 32 },
          3: { fontStyle: 'bold', cellWidth: 52 },
        },
      })

      y = doc.lastAutoTable.finalY + 3

      const marksBody = processedMarks.length
        ? processedMarks.map((m) => [
            String(m.subjectName),
            String(m.fullMarks),
            String(m.passMarks),
            String(m.externalDisplay),
            String(m.internalDisplay),
            String(m.obtainedDisplay),
            String(m.status),
          ])
        : [['No marks available', '--', '--', '--', '--', '--', '--']]

      autoTable(doc, {
        startY: y,
        margin: { left: margin + 3, right: margin + 3 },
        tableWidth: contentWidth - 6,
        head: [['Subject', 'FM', 'Pass', 'Ext', 'Int', 'Obtained', 'Result']],
        body: marksBody,
        theme: 'grid',
        styles: { fontSize: 8.2, cellPadding: 1.8, textColor: [20, 28, 43] },
        headStyles: { fillColor: [231, 236, 245], textColor: [37, 55, 80], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 60, fontStyle: 'bold' },
          1: { halign: 'center', cellWidth: 16 },
          2: { halign: 'center', cellWidth: 16 },
          3: { halign: 'center', cellWidth: 15 },
          4: { halign: 'center', cellWidth: 15 },
          5: { halign: 'center', cellWidth: 20, fontStyle: 'bold' },
          6: { halign: 'center', cellWidth: 20, fontStyle: 'bold' },
        },
      })

      y = doc.lastAutoTable.finalY + 3

      const summaryHeader = ['Metric', ...visibleTerminals.map((t) => `${t} Term`)]
      const summaryRows = [
        ['Total Marks', ...visibleTerminals.map((t) => String(getSummaryCellValue(t, termSummaries[t]?.total_max_marks)))],
        ['Marks Obtained', ...visibleTerminals.map((t) => String(getSummaryCellValue(t, termSummaries[t]?.total_obtained)))],
        [
          'Percentage',
          ...visibleTerminals.map((t) => String(getSummaryCellValue(
            t,
            typeof termSummaries[t]?.percentage !== 'undefined' && termSummaries[t]?.percentage !== null
              ? `${termSummaries[t].percentage}%`
              : '--'
          ))),
        ],
        ['Division', ...visibleTerminals.map((t) => String(getSummaryCellValue(t, termSummaries[t]?.division)))],
        ['Class & Section Rank', ...visibleTerminals.map((t) => String(getDisplayRank(t)))],
        [
          'Published Date',
          ...visibleTerminals.map((t) => {
            const publishedDate = getPublishedDateFromSummary(termSummaries[t])
            if (!isTermAvailable(t)) {
              return 'Result Not Found'
            }
            return publishedDate
              ? new Date(publishedDate).toLocaleDateString('en-IN')
              : '--'
          }),
        ],
      ]

      autoTable(doc, {
        startY: y,
        margin: { left: margin + 3, right: margin + 3 },
        tableWidth: contentWidth - 6,
        head: [summaryHeader],
        body: summaryRows,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 1.8, textColor: [20, 28, 43] },
        headStyles: { fillColor: [231, 236, 245], textColor: [37, 55, 80], fontStyle: 'bold' },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 48 },
        },
      })

      y = doc.lastAutoTable.finalY + 4
      doc.setTextColor(50, 64, 86)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)

      const notes = [
        'This is a computer-generated result marksheet and does not require any signature.',
        'Pass Marks: 30 for regular subjects and 15 for Drawing (FM: 50, External only).',
        'Rank is calculated class and section wise.',
      ]

      notes.forEach((note) => {
        if (y > pageHeight - 18) return
        doc.text(`- ${note}`, margin + 5, y)
        y += 4
      })

      const signatureLineY = Math.max(y + 3, pageHeight - 20)
      doc.setDrawColor(120, 130, 148)
      doc.line(pageWidth - 68, signatureLineY, pageWidth - 18, signatureLineY)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.text("Principal's Signature", pageWidth - 43, signatureLineY + 4, { align: 'center' })

      doc.setFont('helvetica', 'normal')
      doc.text(`Generated: ${todayLabel}`, margin + 5, signatureLineY + 4)

      // Generate PDF blob and open print dialog directly (NO DOWNLOAD, NO NEW WINDOW)
      const pdfBlob = doc.output('blob')
      const pdfUrl = URL.createObjectURL(pdfBlob)
      
      // Create hidden iframe for printing
      const iframe = document.createElement('iframe')
      iframe.style.position = 'fixed'
      iframe.style.right = '0'
      iframe.style.bottom = '0'
      iframe.style.width = '0'
      iframe.style.height = '0'
      iframe.style.border = 'none'
      iframe.src = pdfUrl
      
      document.body.appendChild(iframe)
      
      // Wait for PDF to load then trigger print dialog
      iframe.onload = () => {
        setTimeout(() => {
          try {
            iframe.contentWindow?.print()
            // Clean up after print dialog opens
            setTimeout(() => {
              document.body.removeChild(iframe)
              URL.revokeObjectURL(pdfUrl)
            }, 1000)
          } catch (e) {
            console.error('Print failed:', e)
            document.body.removeChild(iframe)
            URL.revokeObjectURL(pdfUrl)
            fireToast('error', 'Print', 'Unable to open print dialog.')
          }
        }, 500)
      }
      
      fireToast('success', 'Print', 'Print dialog opened.')
    } catch (err) {
      console.error('Failed to open print dialog:', err)
      fireToast('error', 'Print', 'Unable to open print dialog.')
      window.print()
    }
  }

  const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return null
    const numeric = Number(value)
    return Number.isFinite(numeric) ? numeric : null
  }

  const isAbsent = (value) => {
    return typeof value === 'string' && value.trim().toUpperCase() === 'AB'
  }

  const toDisplayValue = (value) => {
    if (value === null || value === undefined || value === '') return '--'
    if (typeof value === 'string') return value.trim() || '--'
    return value
  }

  const getDivisionColor = (division) => {
    switch (division) {
      case 'First':
        return 'text-green-600 dark:text-green-400'
      case 'Second':
        return 'text-blue-600 dark:text-blue-400'
      case 'Third':
        return 'text-purple-600 dark:text-purple-400'
      default:
        return 'text-slate-600 dark:text-slate-400'
    }
  }

  const getRankSuffixFor = (rank) => {
    if (typeof rank !== 'number') return 'th'
    const mod100 = rank % 100
    if (mod100 >= 11 && mod100 <= 13) return 'th'
    switch (rank % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }

  const getSectionRankFromSummary = (summaryRow) => {
    if (!summaryRow) return null
    return (
      summaryRow?.rank ??
      summaryRow?.class_section_rank ??
      summaryRow?.section_rank ??
      summaryRow?.rank_in_section ??
      summaryRow?.classSectionRank ??
      summaryRow?.sectionRank ??
      summaryRow?.section_position ??
      null
    )
  }

  const isTermAvailable = (terminalKey) => {
    return Boolean(termSummaries[terminalKey])
  }

  const getSummaryCellValue = (terminalKey, value, fallback = '--') => {
    if (!isTermAvailable(terminalKey)) return 'Result Not Found'
    if (value === undefined || value === null || value === '') return fallback
    return value
  }

  const getPublishedDateFromSummary = (summaryRow) => {
    if (!summaryRow) return null
    return (
      summaryRow?.published_date ??
      summaryRow?.publish_date ??
      summaryRow?.publishedDate ??
      summaryRow?.published_at ??
      summaryRow?.publishedAt ??
      summaryRow?.result_published_date ??
      null
    )
  }

  const getDisplayRank = (terminalKey) => {
    if (!isTermAvailable(terminalKey)) return 'Result Not Found'

    const summaryRank = getSectionRankFromSummary(termSummaries[terminalKey])
    if (typeof summaryRank === 'number' && Number.isFinite(summaryRank)) {
      return `${summaryRank}${getRankSuffixFor(summaryRank)}`
    }
    if (typeof summaryRank === 'string' && summaryRank.trim()) {
      const numericRank = Number(summaryRank)
      if (Number.isFinite(numericRank)) {
        return `${numericRank}${getRankSuffixFor(numericRank)}`
      }
      return summaryRank
    }
    return '--'
  }

  const currentSummary = termSummaries[normalizeTerminalLabel(params.terminal) || params.terminal] ?? summary

  const processedMarks = useMemo(() => {
    return marks.map((mark, idx) => {
      const subjectName = toDisplayValue(
        mark?.subject || mark?.subject_name || mark?.name || `Subject ${idx + 1}`
      )
      const subjectCode = String(mark?.code || mark?.subject_code || '').trim()

      const combinedRef = `${String(subjectName).toLowerCase()} ${subjectCode.toLowerCase()}`
      const drawingSubject =
        combinedRef.includes('drawing') ||
        subjectCode.toLowerCase() === 'dr' ||
        subjectCode.toLowerCase().startsWith('dr')

      const fullMarks = drawingSubject ? 50 : (toNumber(mark?.max_marks) ?? 100)
      const passMarks = drawingSubject ? 15 : 30

      const externalAbsent = isAbsent(mark?.external_marks)
      const internalAbsent = isAbsent(mark?.internal_marks)
      const totalAbsent = isAbsent(mark?.total_obtained)

      const externalNumeric = toNumber(mark?.external_marks)
      const internalNumeric = drawingSubject ? null : toNumber(mark?.internal_marks)
      const totalNumeric = toNumber(mark?.total_obtained)

      const markAbsent = totalAbsent || externalAbsent || (!drawingSubject && internalAbsent)

      const externalDisplay = externalAbsent ? 'AB' : toDisplayValue(externalNumeric)
      const internalDisplay = drawingSubject
        ? '--'
        : (internalAbsent ? 'AB' : toDisplayValue(internalNumeric))

      let obtainedDisplay = '--'
      let obtainedNumeric = null

      if (markAbsent) {
        obtainedDisplay = 'AB'
      } else if (totalNumeric !== null) {
        obtainedDisplay = totalNumeric
        obtainedNumeric = totalNumeric
      } else if (externalNumeric !== null || internalNumeric !== null) {
        const sum = (externalNumeric ?? 0) + (internalNumeric ?? 0)
        obtainedDisplay = sum
        obtainedNumeric = sum
      }

      let status = '--'
      if (obtainedDisplay === 'AB') {
        status = 'AB'
      } else if (typeof obtainedNumeric === 'number') {
        status = obtainedNumeric >= passMarks ? 'PASS' : 'FAIL'
      }

      return {
        key: `${subjectCode || 'sub'}-${idx}`,
        subjectName,
        fullMarks,
        passMarks,
        externalDisplay,
        internalDisplay,
        obtainedDisplay,
        status,
      }
    })
  }, [marks])

  const todayLabel = useMemo(() => new Date().toLocaleDateString('en-IN'), [])
  const sessionLabel = toDisplayValue(
    student?.academic_year ||
    currentSummary?.academic_year ||
    params.session ||
    `${new Date().getFullYear()}-${String(new Date().getFullYear() + 1).slice(-2)}`
  )

  const downloadFileName = useMemo(() => {
    const safeName = String(student?.name || 'student')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    return `result-card-${params.classValue || 'class'}-${params.roll || 'roll'}-${safeName || 'student'}`
  }, [params.classValue, params.roll, student?.name])

  const studentInfoLeft = [
    ['Name of Student', student?.name || '--'],
    ["Father's Name", student?.father_name || '--'],
    ['Class', student?.class ?? params.classValue ?? '--'],
  ]

  const studentInfoRight = [
    ['Roll Number', student?.roll_no ?? params.roll ?? '--'],
    ['Section', (student?.section ?? params.section) || '--'],
    ['Current Terminal', data?.terminal || params.terminal || '--'],
  ]

  const getInfoIcon = (label) => {
    const normalized = String(label || '').toLowerCase()
    if (normalized.includes('name of student')) return 'person'
    if (normalized.includes("father")) return 'family_restroom'
    if (normalized.includes('class')) return 'school'
    if (normalized.includes('roll')) return 'badge'
    if (normalized.includes('section')) return 'grid_view'
    if (normalized.includes('session')) return 'schedule'
    if (normalized.includes('terminal')) return 'event'
    return 'info'
  }

  const getStatusTextColor = (status) => {
    if (status === 'PASS') return 'text-emerald-700 dark:text-emerald-300'
    if (status === 'FAIL') return 'text-rose-700 dark:text-rose-300'
    if (status === 'AB') return 'text-amber-700 dark:text-amber-300'
    return 'text-[#2b456f] dark:text-slate-200'
  }

  const handleDownloadPdf = () => {
    if (!data) return

    try {
      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 8
      const contentWidth = pageWidth - margin * 2

      doc.setDrawColor(70, 94, 126)
      doc.setLineWidth(0.4)
      doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 4, 4)

      let y = margin + 8
      doc.setFont('times', 'bold')
      doc.setTextColor(31, 52, 96)
      doc.setFontSize(24)
      doc.text(String(SCHOOL_NAME).toUpperCase(), pageWidth / 2, y, { align: 'center' })
      y += 6

      doc.setFont('times', 'bold')
      doc.setTextColor(52, 74, 115)
      doc.setFontSize(10)
      doc.text(String(SCHOOL_ADDRESS).toUpperCase(), pageWidth / 2, y, { align: 'center' })
      y += 7

      doc.setTextColor(42, 63, 103)
      doc.setFontSize(13)
      doc.text(
        `${String(data?.terminal || params.terminal || '--').toUpperCase()} EXAMINATION RESULT - ${sessionLabel}`,
        pageWidth / 2,
        y,
        { align: 'center' }
      )
      y += 4

      doc.setDrawColor(194, 204, 221)
      doc.line(margin + 3, y, pageWidth - margin - 3, y)
      y += 3

      const infoBody = [
        [
          'Name of Student',
          toDisplayValue(student?.name),
          'Roll Number',
          toDisplayValue(student?.roll_no ?? params.roll),
        ],
        [
          "Father's Name",
          toDisplayValue(student?.father_name),
          'Section',
          toDisplayValue(student?.section ?? params.section),
        ],
        [
          'Class',
          toDisplayValue(student?.class ?? params.classValue),
          'Current Terminal',
          toDisplayValue(data?.terminal || params.terminal),
        ],
        [
          'Session',
          toDisplayValue(sessionLabel),
          '',
          '',
        ],
      ]

      autoTable(doc, {
        startY: y,
        margin: { left: margin + 3, right: margin + 3 },
        tableWidth: contentWidth - 6,
        theme: 'grid',
        body: infoBody,
        styles: { fontSize: 9, cellPadding: 2, textColor: [20, 28, 43] },
        columnStyles: {
          0: { fontStyle: 'bold', fillColor: [238, 242, 248], cellWidth: 40 },
          1: { fontStyle: 'bold', cellWidth: 54 },
          2: { fontStyle: 'bold', fillColor: [238, 242, 248], cellWidth: 32 },
          3: { fontStyle: 'bold', cellWidth: 52 },
        },
      })

      y = doc.lastAutoTable.finalY + 3

      const marksBody = processedMarks.length
        ? processedMarks.map((m) => [
            String(m.subjectName),
            String(m.fullMarks),
            String(m.passMarks),
            String(m.externalDisplay),
            String(m.internalDisplay),
            String(m.obtainedDisplay),
            String(m.status),
          ])
        : [['No marks available', '--', '--', '--', '--', '--', '--']]

      autoTable(doc, {
        startY: y,
        margin: { left: margin + 3, right: margin + 3 },
        tableWidth: contentWidth - 6,
        head: [['Subject', 'FM', 'Pass', 'Ext', 'Int', 'Obtained', 'Result']],
        body: marksBody,
        theme: 'grid',
        styles: { fontSize: 8.2, cellPadding: 1.8, textColor: [20, 28, 43] },
        headStyles: { fillColor: [231, 236, 245], textColor: [37, 55, 80], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 60, fontStyle: 'bold' },
          1: { halign: 'center', cellWidth: 16 },
          2: { halign: 'center', cellWidth: 16 },
          3: { halign: 'center', cellWidth: 15 },
          4: { halign: 'center', cellWidth: 15 },
          5: { halign: 'center', cellWidth: 20, fontStyle: 'bold' },
          6: { halign: 'center', cellWidth: 20, fontStyle: 'bold' },
        },
      })

      y = doc.lastAutoTable.finalY + 3

      const summaryHeader = ['Metric', ...visibleTerminals.map((t) => `${t} Term`)]
      const summaryRows = [
        ['Total Marks', ...visibleTerminals.map((t) => String(getSummaryCellValue(t, termSummaries[t]?.total_max_marks)))],
        ['Marks Obtained', ...visibleTerminals.map((t) => String(getSummaryCellValue(t, termSummaries[t]?.total_obtained)))],
        [
          'Percentage',
          ...visibleTerminals.map((t) => String(getSummaryCellValue(
            t,
            typeof termSummaries[t]?.percentage !== 'undefined' && termSummaries[t]?.percentage !== null
              ? `${termSummaries[t].percentage}%`
              : '--'
          ))),
        ],
        ['Division', ...visibleTerminals.map((t) => String(getSummaryCellValue(t, termSummaries[t]?.division)))],
        ['Class & Section Rank', ...visibleTerminals.map((t) => String(getDisplayRank(t)))],
        [
          'Published Date',
          ...visibleTerminals.map((t) => {
            const publishedDate = getPublishedDateFromSummary(termSummaries[t])
            if (!isTermAvailable(t)) {
              return 'Result Not Found'
            }
            return publishedDate
              ? new Date(publishedDate).toLocaleDateString('en-IN')
              : '--'
          }),
        ],
      ]

      autoTable(doc, {
        startY: y,
        margin: { left: margin + 3, right: margin + 3 },
        tableWidth: contentWidth - 6,
        head: [summaryHeader],
        body: summaryRows,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 1.8, textColor: [20, 28, 43] },
        headStyles: { fillColor: [231, 236, 245], textColor: [37, 55, 80], fontStyle: 'bold' },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 48 },
        },
      })

      y = doc.lastAutoTable.finalY + 4
      doc.setTextColor(50, 64, 86)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)

      const notes = [
        'This is a computer-generated result marksheet and does not require any signature.',
        'Pass Marks: 30 for regular subjects and 15 for Drawing (FM: 50, External only).',
        'Rank is calculated class and section wise.',
      ]

      notes.forEach((note) => {
        if (y > pageHeight - 18) return
        doc.text(`- ${note}`, margin + 5, y)
        y += 4
      })

      const signatureLineY = Math.max(y + 3, pageHeight - 20)
      doc.setDrawColor(120, 130, 148)
      doc.line(pageWidth - 68, signatureLineY, pageWidth - 18, signatureLineY)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.text("Principal's Signature", pageWidth - 43, signatureLineY + 4, { align: 'center' })

      doc.setFont('helvetica', 'normal')
      doc.text(`Generated: ${todayLabel}`, margin + 5, signatureLineY + 4)

      // Generate PDF and download only (NO PRINT DIALOG)
      doc.save(`${downloadFileName}.pdf`)
      
      fireToast('success', 'Download', 'Result card PDF downloaded.')
    } catch (err) {
      console.error('Failed to download result card PDF:', err)
      fireToast('error', 'Download', 'Unable to download result card PDF.')
      window.print()
    }
  }

  return (
    <WebsiteLayout>
      <div className="bg-[#edf2fb] dark:bg-[#0f1724] text-slate-900 dark:text-slate-100 overflow-x-hidden" style={{ fontFamily: "'Lexend', sans-serif" }}>
        <header className="no-print relative z-30 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-white/95 via-white/85 to-[#dbeafe]/75 dark:from-[#0f1724]/95 dark:via-[#0f1724]/85 dark:to-[#17233a]/75 backdrop-blur">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 min-w-0">
           
          </div>

          <div className="relative z-40 flex flex-wrap items-center gap-2 pointer-events-auto">
            <Link
              to="/results-portal"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              New Search
            </Link>
            {data ? (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handlePrint()
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#137fec] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#137fec]/90 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  Print Card
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleDownloadPdf()
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#0f766e] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0f766e]/90 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download PDF
                </button>
              </>
            ) : null}
           
            
          </div>
        </div>
      </header>

        <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4">
        <div className="bg-gradient-to-r from-white to-[#eef4ff] dark:from-slate-800 dark:to-slate-800/90 rounded-2xl border border-[#d4deee] dark:border-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-4 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#137fec]">badge</span>
              <div>
                <p className="text-sm font-bold">Class {params.classValue || '--'} | Roll {params.roll || '--'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Terminal: <span className="font-bold">{params.terminal || '--'}</span>
                  {params.section ? (
                    <>
                      {' '}
                      | Section: <span className="font-bold">{params.section}</span>
                    </>
                  ) : null}
                  {params.session ? (
                    <>
                      {' '}
                      | Session: <span className="font-bold">{params.session}</span>
                    </>
                  ) : null}
                </p>
              </div>
            </div>
            {currentSummary?.status ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-[#137fec]/15 to-[#1f5fb8]/15 text-[#0f5fc6] border border-[#137fec]/20">
                <span className="material-symbols-outlined text-sm">verified</span>
                {currentSummary.status}
              </span>
            ) : null}
          </div>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined animate-spin">sync</span>
              <span className="text-sm font-bold">Fetching result...</span>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-4">
            <p className="text-sm font-bold text-red-700 dark:text-red-300">{error}</p>
            <p className="text-xs text-red-600/80 dark:text-red-300/80 mt-1">
              Please verify details and ensure result is published for the selected terminal.
            </p>
          </div>
        ) : null}

        {(!loading && !error && data) && (
          <>
            <div className="print-card-only">
              <div
                ref={cardRef}
                className="relative isolate bg-[#f6f7fb] dark:bg-slate-800 border-2 border-[#c8d2e1] dark:border-slate-600 rounded-[30px] overflow-hidden shadow-[0_28px_80px_rgba(15,23,42,0.18)] result-print print-card text-[13px] sm:text-[14px] leading-[1.45]"
                style={{ maxWidth: '980px', margin: '0 auto' }}
              >
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <p className="select-none text-[38px] sm:text-[64px] font-medium tracking-[0.1em] uppercase text-slate-400/10 -rotate-[30deg]">
                    {SCHOOL_NAME}
                  </p>
                </div>
                <div className="pointer-events-none absolute -top-16 -right-12 h-48 w-48 rounded-full bg-[#1f6fd7]/14 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-[#d09a3d]/12 blur-3xl" />

                <div className="relative z-10">
                  <div className="border-b border-[#cfd5df] dark:border-slate-600 bg-[linear-gradient(180deg,#f8faff_0%,#eef3fa_100%)] dark:bg-slate-800">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-center gap-3 sm:gap-7 rounded-2xl border border-[#d3dded] dark:border-slate-700 bg-white/55 dark:bg-slate-800/70 backdrop-blur-sm px-3 py-3 sm:px-5 sm:py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                        <div className="shrink-0">
                          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border border-[#ccb46e] bg-gradient-to-br from-[#fff2c6] via-[#f3da86] to-[#c8a651] p-1.5 shadow-[0_10px_24px_rgba(168,128,43,0.35)]">
                            <img src={schoolLogo} alt="School logo" className="h-full w-full object-cover rounded-xl" />
                          </div>
                        </div>

                        <div className="min-w-0 text-left">
                          <p className="inline-flex items-center rounded-full border border-[#d7e2f4] bg-white/80 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-semibold tracking-[0.08em] text-[#40577d] uppercase">
                            Academic Result Card
                          </p>
                          <h1 className="text-[18px] sm:text-[32px] font-bold leading-tight tracking-[0.01em] text-[#1f3460] uppercase print:text-xl" style={{ fontFamily: "'Cambria', 'Georgia', serif" }}>
                            {SCHOOL_NAME}
                          </h1>
                          <p className="text-[10px] sm:text-[13px] font-medium mt-1 text-[#334a73] print:text-xs" style={{ fontFamily: "'Cambria', 'Georgia', serif" }}>
                            {SCHOOL_ADDRESS}
                          </p>
                          <p className="text-[12px] sm:text-[22px] font-semibold mt-1.5 text-[#2a3f67] uppercase print:text-sm" style={{ fontFamily: "'Cambria', 'Georgia', serif" }}>
                            {data.terminal} Examination Result - {sessionLabel}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 pt-4">
                    <div className="rounded-2xl overflow-hidden border border-[#cfd5df] dark:border-slate-600 bg-white/90 dark:bg-slate-800/70 backdrop-blur-sm shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                      <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-[#d9dfeb] dark:divide-slate-700">
                        {[studentInfoLeft, studentInfoRight].map((group, groupIndex) => (
                          <div
                            key={groupIndex === 0 ? 'left-col' : 'right-col'}
                            className={`${groupIndex === 1 ? 'border-t md:border-t-0 border-[#d9dfeb] dark:border-slate-700' : ''}`}
                          >
                            {group.map(([label, value]) => (
                              <div key={label} className="grid grid-cols-[132px_minmax(0,1fr)] sm:grid-cols-[180px_minmax(0,1fr)] border-b border-[#dde3eb] dark:border-slate-700 last:border-b-0">
                                <div className="px-3 sm:px-4 py-2.5 sm:py-3 font-semibold text-[#2d3c56] dark:text-slate-200 bg-[#eef2f8] dark:bg-slate-700 flex items-center gap-1.5">
                                  <span className="material-symbols-outlined text-sm text-[#36598e] dark:text-slate-300">{getInfoIcon(label)}</span>
                                  <span>{label}:</span>
                                </div>
                                <div className="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-[#1e2e46] dark:text-white">
                                  {value}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 pt-4">
                    <div className="rounded-2xl overflow-hidden border border-[#cfd5df] dark:border-slate-600 bg-white/90 dark:bg-slate-800/70 backdrop-blur-sm shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                      <div className="px-3 sm:px-4 py-2.5 bg-gradient-to-r from-[#eef2f8] to-[#e4ecfa] dark:from-slate-700 dark:to-slate-700 border-b border-[#d9dfeb] dark:border-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#22334d] dark:text-white uppercase tracking-[0.06em]">Subject Details</h3>
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 font-semibold bg-[#dce8ff] text-[#2d4f82] dark:bg-slate-800 dark:text-slate-300">{processedMarks.length} Subjects</span>
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 font-semibold bg-white text-[#3e4f6c] dark:bg-slate-800 dark:text-slate-300">Pass: 30</span>
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 font-semibold bg-[#fff2cf] text-[#8c5c16] dark:bg-amber-900/30 dark:text-amber-300">Drawing Pass: 15</span>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-[12px] sm:text-[13px]">
                          <thead>
                            <tr className="bg-[#dfe9f9] dark:bg-slate-700 text-[#253750] dark:text-slate-100">
                              <th className="border border-[#d5dbe7] dark:border-slate-600 px-3 py-2.5 text-left font-semibold">Subject Details</th>
                              <th className="border border-[#d5dbe7] dark:border-slate-600 px-2 py-2.5 text-center font-semibold">Full Marks</th>
                              <th className="border border-[#d5dbe7] dark:border-slate-600 px-2 py-2.5 text-center font-semibold">Pass Marks</th>
                              <th className="border border-[#d5dbe7] dark:border-slate-600 px-2 py-2.5 text-center font-semibold">Ext</th>
                              <th className="border border-[#d5dbe7] dark:border-slate-600 px-2 py-2.5 text-center font-semibold">Int</th>
                              <th className="border border-[#d5dbe7] dark:border-slate-600 px-2 py-2.5 text-center font-semibold">Obtained</th>
                              <th className="border border-[#d5dbe7] dark:border-slate-600 px-2 py-2.5 text-center font-semibold">Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            {processedMarks.length === 0 && (
                              <tr>
                                <td colSpan={7} className="text-center py-6 text-slate-600 dark:text-slate-400">No marks available</td>
                              </tr>
                            )}

                            {processedMarks.map((m, idx) => (
                              <tr key={m.key} className={`${idx % 2 === 0 ? 'bg-white dark:bg-slate-800/60' : 'bg-[#f9fbff] dark:bg-slate-800/40'} hover:bg-[#edf4ff] dark:hover:bg-slate-700/40 transition-colors`}>
                                <td className="border border-[#dde3ec] dark:border-slate-700 px-3 py-2.5 font-semibold text-[#1e2f48] dark:text-white">{m.subjectName}</td>
                                <td className="border border-[#dde3ec] dark:border-slate-700 px-2 py-2.5 text-center font-medium text-[#2a3d59] dark:text-slate-200">{m.fullMarks}</td>
                                <td className="border border-[#dde3ec] dark:border-slate-700 px-2 py-2.5 text-center font-medium text-[#3b527a] dark:text-slate-200">{m.passMarks}</td>
                                <td className="border border-[#dde3ec] dark:border-slate-700 px-2 py-2.5 text-center font-medium text-[#2a3a53] dark:text-slate-200">{m.externalDisplay}</td>
                                <td className="border border-[#dde3ec] dark:border-slate-700 px-2 py-2.5 text-center font-medium text-[#2a3a53] dark:text-slate-200">{m.internalDisplay}</td>
                                <td className="border border-[#dde3ec] dark:border-slate-700 px-2 py-2.5 text-center font-semibold text-[#1f3f67] dark:text-slate-100">{m.obtainedDisplay}</td>
                                <td className={`border border-[#dde3ec] dark:border-slate-700 px-2 py-2.5 text-center font-semibold ${getStatusTextColor(m.status)}`}>{m.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 pt-4">
                    <div className="rounded-2xl overflow-hidden border border-[#cfd5df] dark:border-slate-600 bg-white/90 dark:bg-slate-800/70 backdrop-blur-sm shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                      <div className="px-3 sm:px-4 py-2.5 bg-gradient-to-r from-[#eef2f8] to-[#e4ecfa] dark:from-slate-700 dark:to-slate-700 border-b border-[#d9dfeb] dark:border-slate-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#22334d] dark:text-white uppercase tracking-[0.06em]">Summary Report</h3>
                        <span className="inline-flex items-center rounded-full bg-[#dce8ff] dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-[#3d5378] dark:text-blue-300">Rank Scope: Class + Section</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[690px] text-[12px] sm:text-[13px]">
                          <thead>
                            <tr className="bg-[#dfe9f9] dark:bg-slate-700 text-[#253750] dark:text-slate-100">
                              <th className="border border-[#d5dbe7] dark:border-slate-600 px-3 py-2.5 text-left font-semibold">Metric</th>
                              {visibleTerminals.map((t) => (
                                <th key={t} className="border border-[#d5dbe7] dark:border-slate-600 px-3 py-2.5 text-center font-semibold">{t} Term</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-[#edf4ff] dark:hover:bg-slate-700/40 transition-colors">
                              <td className="border border-[#dde3ec] dark:border-slate-700 px-3 py-2.5 font-semibold text-[#1f2f46] dark:text-white">Total Marks</td>
                              {visibleTerminals.map((t) => (
                                <td key={t} className="border border-[#dde3ec] dark:border-slate-700 px-3 py-2.5 text-center font-medium text-[#2a3d59] dark:text-slate-200">
                                  {getSummaryCellValue(t, termSummaries[t]?.total_max_marks)}
                                </td>
                              ))}
                            </tr>
                            <tr className="bg-[#f9fbff] dark:bg-slate-800/40 hover:bg-[#edf4ff] dark:hover:bg-slate-700/40 transition-colors">
                              <td className="border border-[#dde3ec] dark:border-slate-700 px-3 py-2.5 font-semibold text-[#1f2f46] dark:text-white">Marks Obtained</td>
                              {visibleTerminals.map((t) => (
                                <td key={t} className="border border-[#dde3ec] dark:border-slate-700 px-3 py-2.5 text-center font-semibold text-[#1f406f] dark:text-blue-300">
                                  {getSummaryCellValue(t, termSummaries[t]?.total_obtained)}
                                </td>
                              ))}
                            </tr>
                            <tr className="hover:bg-[#edf4ff] dark:hover:bg-slate-700/40 transition-colors">
                              <td className="border border-[#dde3ec] dark:border-slate-700 px-3 py-2.5 font-semibold text-[#1f2f46] dark:text-white">Percentage</td>
                              {visibleTerminals.map((t) => (
                                <td key={t} className={`border border-[#dde3ec] dark:border-slate-700 px-3 py-2.5 text-center font-semibold ${getDivisionColor(termSummaries[t]?.division)}`}>
                                  {getSummaryCellValue(
                                    t,
                                    typeof termSummaries[t]?.percentage !== 'undefined' && termSummaries[t]?.percentage !== null
                                      ? `${termSummaries[t].percentage}%`
                                      : '--'
                                  )}
                                </td>
                              ))}
                            </tr>
                            <tr className="bg-[#f9fbff] dark:bg-slate-800/40 hover:bg-[#edf4ff] dark:hover:bg-slate-700/40 transition-colors">
                              <td className="border border-[#dde3ec] dark:border-slate-700 px-3 py-2.5 font-semibold text-[#1f2f46] dark:text-white">Division</td>
                              {visibleTerminals.map((t) => (
                                <td key={t} className={`border border-[#dde3ec] dark:border-slate-700 px-3 py-2.5 text-center font-semibold ${getDivisionColor(termSummaries[t]?.division)}`}>
                                  {getSummaryCellValue(t, termSummaries[t]?.division)}
                                </td>
                              ))}
                            </tr>
                            <tr className="hover:bg-[#edf4ff] dark:hover:bg-slate-700/40 transition-colors">
                              <td className="border border-[#dde3ec] dark:border-slate-700 px-3 py-2.5 font-semibold text-[#1f2f46] dark:text-white">Class &amp; Section Rank</td>
                              {visibleTerminals.map((t) => (
                                <td key={t} className="border border-[#dde3ec] dark:border-slate-700 px-3 py-2.5 text-center font-semibold text-[#2b456f] dark:text-blue-300">
                                  {getDisplayRank(t)}
                                </td>
                              ))}
                            </tr>
                            <tr className="bg-[#f9fbff] dark:bg-slate-800/40 hover:bg-[#edf4ff] dark:hover:bg-slate-700/40 transition-colors">
                              <td className="border border-[#dde3ec] dark:border-slate-700 px-3 py-2.5 font-semibold text-[#1f2f46] dark:text-white">Published Date</td>
                              {visibleTerminals.map((t) => {
                                const publishedDate = getPublishedDateFromSummary(termSummaries[t])
                                return (
                                  <td key={t} className="border border-[#dde3ec] dark:border-slate-700 px-3 py-2.5 text-center font-medium text-[#2a3d59] dark:text-slate-300">
                                    {isTermAvailable(t) ? (
                                      publishedDate 
                                        ? new Date(publishedDate).toLocaleDateString('en-IN')
                                        : '--'
                                    ) : (
                                      'Result Not Found'
                                    )}
                                  </td>
                                )
                              })}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 pt-4 pb-5">
                    <div className="rounded-2xl border border-[#cfd5df] dark:border-slate-600 bg-gradient-to-br from-white to-[#f3f7ff] dark:from-slate-800/80 dark:to-slate-800/60 px-4 sm:px-5 py-4 sm:py-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_230px] gap-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                      <div>
                        <p className="text-base font-semibold text-center lg:text-left text-[#243653] dark:text-white mb-3 uppercase tracking-[0.06em]">Important Information</p>
                        <ul className="space-y-2 text-[12px] sm:text-[13px] text-[#37485f] dark:text-slate-300">
                          <li className="flex gap-2"><span className="text-[#2f66b8]">-</span><span>This is a computer-generated result marksheet and does not require any signature.</span></li>
                          <li className="flex gap-2"><span className="text-[#2f66b8]">-</span><span>The details shown here are based on official school records.</span></li>
                          <li className="flex gap-2"><span className="text-[#2f66b8]">-</span><span>Any discrepancy should be reported within 7 days of result declaration.</span></li>
                          <li className="flex gap-2"><span className="text-[#2f66b8]">-</span><span><strong>AB</strong> denotes absent and <strong>NA</strong> denotes not applicable.</span></li>
                          <li className="flex gap-2"><span className="text-[#2f66b8]">-</span><span>Pass Marks: 30 for regular subjects and 15 for Drawing.</span></li>
                          <li className="flex gap-2"><span className="text-[#2f66b8]">-</span><span>Drawing is evaluated only by External marks (FM: 50).</span></li>
                          <li className="flex gap-2"><span className="text-[#2f66b8]">-</span><span>Rank displayed above is calculated class and section wise.</span></li>
                        </ul>
                      </div>

                      <div className="flex flex-col justify-between">
                        <div className="rounded-xl bg-[#eef2f8] dark:bg-slate-700 border border-[#d9dfeb] dark:border-slate-600 px-3 py-2 text-center">
                          <p className="text-[11px] font-semibold uppercase text-[#3d5275] dark:text-slate-200">Generated On</p>
                          <p className="text-sm font-semibold text-[#233650] dark:text-white">{todayLabel}</p>
                        </div>
                        <div className="mt-6 text-center">
                          <div className="h-12 border-b-2 border-[#8b97ac] dark:border-slate-500"></div>
                          <p className="mt-2 text-sm font-semibold text-[#233650] dark:text-slate-300">Principal&apos;s Signature &amp; Stamp</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 pb-5 text-center text-[11px] font-semibold text-[#41516c] dark:text-slate-400 border-t border-[#d7e0ee] dark:border-slate-700 pt-3">
                    {SCHOOL_NAME} | {SCHOOL_ADDRESS}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        </main>
      </div>
    </WebsiteLayout>
  )
}

export default Results

