import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { getStudentResultPublic } from '../../Api/marks'
import schoolLogo from '../../assets/logo.png'
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
  const [pdfBusy, setPdfBusy] = useState(false)
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

  const triggerBlobDownload = (blob, fileName) => {
    const fileUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1500)
  }

  const createHighQualityPdfBlob = async () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 10
    const contentWidth = pageWidth - margin * 2
    let cursorY = 14

    const setText = (fontSize, style = 'normal') => {
      doc.setFont('times', style)
      doc.setFontSize(fontSize)
      doc.setTextColor(20, 20, 20)
    }

    const ensureSpace = (heightNeeded = 10) => {
      if (cursorY + heightNeeded <= pageHeight - 12) return
      doc.addPage()
      cursorY = 14
    }

    const subjectRows = processedMarks.length > 0
      ? processedMarks.map((mark) => ([
        String(mark.subjectName || '--'),
        String(mark.fullMarks ?? '--'),
        String(mark.passMarks ?? '--'),
        String(mark.externalDisplay ?? '--'),
        String(mark.internalDisplay ?? '--'),
        String(mark.obtainedDisplay ?? '--'),
        String(mark.status ?? '--'),
      ]))
      : [['No marks available', '--', '--', '--', '--', '--', '--']]

    const summaryHeader = ['Metric', ...visibleTerminals.map((terminalKey) => `${terminalKey} Term`)]
    const summaryRows = [
      ['Total Marks', ...visibleTerminals.map((terminalKey) => String(getSummaryCellValue(terminalKey, termSummaries[terminalKey]?.total_max_marks)))],
      ['Marks Obtained', ...visibleTerminals.map((terminalKey) => String(getSummaryCellValue(terminalKey, termSummaries[terminalKey]?.total_obtained)))],
      [
        'Percentage',
        ...visibleTerminals.map((terminalKey) => String(getSummaryCellValue(
          terminalKey,
          typeof termSummaries[terminalKey]?.percentage !== 'undefined' && termSummaries[terminalKey]?.percentage !== null
            ? `${termSummaries[terminalKey].percentage}%`
            : '--'
        ))),
      ],
      ['Division', ...visibleTerminals.map((terminalKey) => String(getSummaryCellValue(terminalKey, termSummaries[terminalKey]?.division)))],
      ['Class & Section Rank', ...visibleTerminals.map((terminalKey) => String(getDisplayRank(terminalKey)))],
      [
        'Published Date',
        ...visibleTerminals.map((terminalKey) => {
          const publishedDate = getPublishedDateFromSummary(termSummaries[terminalKey])
          if (!isTermAvailable(terminalKey)) return 'Result Not Found'
          return publishedDate ? new Date(publishedDate).toLocaleDateString('en-IN') : '--'
        }),
      ],
    ]

    setText(20, 'bold')
    doc.text(String(SCHOOL_NAME).toUpperCase(), pageWidth / 2, cursorY, { align: 'center' })
    cursorY += 7

    setText(10, 'normal')
    doc.text(String(SCHOOL_ADDRESS), pageWidth / 2, cursorY, { align: 'center' })
    cursorY += 7

    setText(16, 'bold')
    doc.text(
      `${String(data?.terminal || params.terminal || '--').toUpperCase()} EXAMINATION RESULT`,
      pageWidth / 2,
      cursorY,
      { align: 'center' }
    )
    cursorY += 6

    setText(11, 'bold')
    doc.text(`Session: ${sessionLabel}`, pageWidth / 2, cursorY, { align: 'center' })
    cursorY += 6

    doc.setDrawColor(120, 120, 120)
    doc.line(margin, cursorY, pageWidth - margin, cursorY)
    cursorY += 5

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
      theme: 'grid',
      styles: {
        font: 'times',
        fontSize: 9,
        textColor: [20, 20, 20],
        cellPadding: 2,
        lineColor: [140, 140, 140],
        lineWidth: 0.2,
      },
      body: [
        ['Student Name', toDisplayValue(student?.name), 'Roll Number', toDisplayValue(student?.roll_no ?? params.roll)],
        ["Father's Name", toDisplayValue(student?.father_name), 'Section', toDisplayValue(student?.section ?? params.section)],
        ['Class', toDisplayValue(student?.class ?? params.classValue), 'Current Terminal', toDisplayValue(data?.terminal || params.terminal)],
        ['Session', toDisplayValue(sessionLabel), 'Generated On', toDisplayValue(todayLabel)],
      ],
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 32 },
        1: { cellWidth: 63 },
        2: { fontStyle: 'bold', cellWidth: 32 },
        3: { cellWidth: 63 },
      },
    })
    cursorY = doc.lastAutoTable.finalY + 5

    ensureSpace(18)
    setText(12, 'bold')
    doc.text('Subject Marks', margin, cursorY)
    cursorY += 2

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
      theme: 'grid',
      head: [['Subject', 'FM', 'Pass', 'Ext', 'Int', 'Obt.', 'Result']],
      body: subjectRows,
      styles: {
        font: 'times',
        fontSize: 8,
        textColor: [20, 20, 20],
        cellPadding: 1.6,
        lineColor: [140, 140, 140],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: [20, 20, 20],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 62, fontStyle: 'bold' },
        1: { cellWidth: 14, halign: 'center' },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 14, halign: 'center' },
        4: { cellWidth: 14, halign: 'center' },
        5: { cellWidth: 18, halign: 'center' },
        6: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
      },
    })
    cursorY = doc.lastAutoTable.finalY + 5

    ensureSpace(18)
    setText(12, 'bold')
    doc.text('Summary Report', margin, cursorY)
    cursorY += 2

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
      theme: 'grid',
      head: [summaryHeader],
      body: summaryRows,
      styles: {
        font: 'times',
        fontSize: 8,
        textColor: [20, 20, 20],
        cellPadding: 1.6,
        lineColor: [140, 140, 140],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: [20, 20, 20],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 42, fontStyle: 'bold' },
      },
    })
    cursorY = doc.lastAutoTable.finalY + 5

    ensureSpace(20)
    setText(9, 'normal')
    const notes = [
      'This is a computer-generated result marksheet.',
      'AB denotes absent and NA denotes not applicable.',
      'Pass Marks: 30 for regular subjects and 15 for Drawing.',
      'Rank displayed above is calculated class and section wise.',
    ]
    notes.forEach((note) => {
      doc.text(`- ${note}`, margin, cursorY)
      cursorY += 4.5
    })

    cursorY += 4
    doc.line(pageWidth - 62, cursorY, pageWidth - margin, cursorY)
    setText(9, 'bold')
    doc.text("Principal's Signature", pageWidth - 36, cursorY + 4, { align: 'center' })

    return doc.output('blob')
  }

  const handleDownloadPdf = async () => {
    if (!data || pdfBusy) return

    setPdfBusy(true)
    try {
      const pdfBlob = await createHighQualityPdfBlob()
      triggerBlobDownload(pdfBlob, `${downloadFileName}.pdf`)
      fireToast('success', 'Download', 'High-quality PDF downloaded.')
    } catch (err) {
      console.error('PDF download failed:', err)
      const message = err?.message ? `Unable to download PDF. ${err.message}` : 'Unable to download PDF.'
      fireToast('error', 'Download', message)
    } finally {
      setPdfBusy(false)
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
                  disabled={pdfBusy}
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    handleDownloadPdf()
                  }}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#9b2335] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#9b2335]/90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-sm">{pdfBusy ? 'hourglass_top' : 'picture_as_pdf'}</span>
                  {pdfBusy ? 'Preparing PDF...' : 'Download PDF'}
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
              <span className="material-symbols-outlined text-[#c79843]">badge</span>
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
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-[#1f3f7a]/14 to-[#355fa8]/12 text-[#244f97] border border-[#1f3f7a]/25">
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
                data-result-card-capture="true"
                className="relative isolate overflow-hidden rounded-[34px] border border-[#d8c39a] bg-[radial-gradient(circle_at_top_right,#fff7e5_0%,#f7fbff_42%,#eef4ff_100%)] shadow-[0_24px_68px_rgba(37,52,93,0.18)] ring-1 ring-white/75 result-print print-card text-[13px] sm:text-[14px] leading-[1.45]"
                style={{ width: '100%', maxWidth: '980px', margin: '0 auto' }}
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#1f3f7a] via-[#c79843] to-[#2f63ad]" />
                <div className="result-watermark pointer-events-none absolute inset-0 flex items-center justify-center">
                  <p className="select-none text-[38px] sm:text-[72px] font-semibold tracking-[0.12em] uppercase text-[#1f3f7a]/8 -rotate-[28deg]">
                    {SCHOOL_NAME}
                  </p>
                </div>
                <div className="pointer-events-none absolute -top-20 -right-14 h-52 w-52 rounded-full bg-[#1f3f7a]/14 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-14 h-56 w-56 rounded-full bg-[#c79843]/18 blur-3xl" />

                <div className="relative z-10">
                  <div className="border-b border-[#d8c9a8] bg-[linear-gradient(180deg,#fffdf8_0%,#f8efdf_54%,#eef4ff_100%)]">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col items-start gap-4 rounded-[26px] border border-[#dbc8a2] bg-white/78 px-3 py-3 shadow-[0_12px_28px_rgba(120,94,53,0.12)] sm:flex-row sm:items-center sm:justify-between sm:gap-7 sm:px-5 sm:py-4">
                        <div className="shrink-0">
                          <div className="h-24 w-24 rounded-2xl border border-[#ccb46e] bg-gradient-to-br from-[#fff3ce] via-[#f2d88f] to-[#c89d4c] p-1.5 shadow-[0_10px_24px_rgba(168,128,43,0.35)] sm:h-28 sm:w-28">
                            <img src={schoolLogo} alt="School logo" className="h-full w-full object-cover rounded-xl" />
                          </div>
                        </div>

                        <div className="min-w-0 text-left">
                          <p className="inline-flex items-center rounded-full border border-[#d6c39f] bg-[#fff6e4] px-2.5 py-0.5 text-[9px] font-semibold tracking-[0.1em] text-[#75501f] uppercase sm:text-[10px]">
                            Academic Result Card
                          </p>
                          <h1 className="text-[18px] font-black leading-tight tracking-[0.02em] text-[#1a3261] uppercase print:text-xl sm:text-[32px]" style={{ fontFamily: "'Cambria', 'Georgia', serif" }}>
                            {SCHOOL_NAME}
                          </h1>
                          <p className="mt-1 text-[10px] font-medium text-[#3a5078] print:text-xs sm:text-[13px]" style={{ fontFamily: "'Cambria', 'Georgia', serif" }}>
                            {SCHOOL_ADDRESS}
                          </p>
                          <p className="mt-1.5 text-[12px] font-semibold text-[#2a3f67] uppercase print:text-sm sm:text-[22px]" style={{ fontFamily: "'Cambria', 'Georgia', serif" }}>
                            {data.terminal} Examination Result - {sessionLabel}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] sm:text-[11px]">
                            <span className="inline-flex items-center rounded-full border border-[#d3c09c] bg-[#fff9ed] px-2.5 py-0.5 font-semibold text-[#6a4a1f]">
                              Class {student?.class ?? params.classValue ?? '--'}
                            </span>
                            <span className="inline-flex items-center rounded-full border border-[#c6d4ea] bg-[#eef4ff] px-2.5 py-0.5 font-semibold text-[#34517f]">
                              Roll {student?.roll_no ?? params.roll ?? '--'}
                            </span>
                            <span className="inline-flex items-center rounded-full border border-[#d7caa9] bg-[#f8eedc] px-2.5 py-0.5 font-semibold text-[#7f5a23]">
                              Section {(student?.section ?? params.section) || '--'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 pt-4">
                    <div className="overflow-hidden rounded-2xl border border-[#d8c7a5]/75 bg-white/88 shadow-[0_12px_28px_rgba(76,93,128,0.12)]">
                      <div className="grid grid-cols-1 divide-[#e4d8be] md:grid-cols-2 md:divide-x">
                        {[studentInfoLeft, studentInfoRight].map((group, groupIndex) => (
                          <div
                            key={groupIndex === 0 ? 'left-col' : 'right-col'}
                            className={`${groupIndex === 1 ? 'border-t border-[#e4d8be] md:border-t-0' : ''}`}
                          >
                            {group.map(([label, value]) => (
                              <div key={label} className="grid grid-cols-[132px_minmax(0,1fr)] border-b border-[#ece1c8] last:border-b-0 sm:grid-cols-[180px_minmax(0,1fr)]">
                                <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#fff6e8] to-[#f7ebd8] px-3 py-2.5 font-semibold text-[#5d4324] sm:px-4 sm:py-3">
                                  <span className="material-symbols-outlined text-sm text-[#8a6328]">{getInfoIcon(label)}</span>
                                  <span>{label}:</span>
                                </div>
                                <div className="px-3 py-2.5 font-semibold text-[#243958] sm:px-4 sm:py-3">
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
                    <div className="overflow-hidden rounded-2xl border border-[#d8c7a5]/75 bg-white/88 shadow-[0_12px_28px_rgba(76,93,128,0.12)]">
                      <div className="flex flex-col gap-2 border-b border-[#e1d3b8] bg-gradient-to-r from-[#1f3f7a] via-[#2f5b97] to-[#b07f31] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#fff3dc]">Subject Details</h3>
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="inline-flex items-center rounded-full bg-white/92 px-2 py-0.5 font-semibold text-[#26426d]">{processedMarks.length} Subjects</span>
                          <span className="inline-flex items-center rounded-full bg-[#fff3d8] px-2 py-0.5 font-semibold text-[#7d5520]">Pass: 30</span>
                          <span className="inline-flex items-center rounded-full bg-[#f5dfb0] px-2 py-0.5 font-semibold text-[#704b18]">Drawing Pass: 15</span>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-[12px] sm:text-[13px]">
                          <thead>
                            <tr className="bg-[#f4ead5] text-[#4e3618]">
                              <th className="border border-[#e0d3b8] px-3 py-2.5 text-left font-semibold">Subject Details</th>
                              <th className="border border-[#e0d3b8] px-2 py-2.5 text-center font-semibold">Full Marks</th>
                              <th className="border border-[#e0d3b8] px-2 py-2.5 text-center font-semibold">Pass Marks</th>
                              <th className="border border-[#e0d3b8] px-2 py-2.5 text-center font-semibold">Ext</th>
                              <th className="border border-[#e0d3b8] px-2 py-2.5 text-center font-semibold">Int</th>
                              <th className="border border-[#e0d3b8] px-2 py-2.5 text-center font-semibold">Obtained</th>
                              <th className="border border-[#e0d3b8] px-2 py-2.5 text-center font-semibold">Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            {processedMarks.length === 0 && (
                              <tr>
                                <td colSpan={7} className="py-6 text-center text-slate-600">No marks available</td>
                              </tr>
                            )}

                            {processedMarks.map((m, idx) => (
                              <tr key={m.key} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#fffbf2]'} transition-colors hover:bg-[#f2f8ff]`}>
                                <td className="border border-[#e8dcc2] px-3 py-2.5 font-semibold text-[#233754]">{m.subjectName}</td>
                                <td className="border border-[#e8dcc2] px-2 py-2.5 text-center font-medium text-[#2a3d59]">{m.fullMarks}</td>
                                <td className="border border-[#e8dcc2] px-2 py-2.5 text-center font-medium text-[#3b527a]">{m.passMarks}</td>
                                <td className="border border-[#e8dcc2] px-2 py-2.5 text-center font-medium text-[#2a3a53]">{m.externalDisplay}</td>
                                <td className="border border-[#e8dcc2] px-2 py-2.5 text-center font-medium text-[#2a3a53]">{m.internalDisplay}</td>
                                <td className="border border-[#e8dcc2] px-2 py-2.5 text-center font-semibold text-[#1f3f67]">{m.obtainedDisplay}</td>
                                <td className={`border border-[#e8dcc2] px-2 py-2.5 text-center font-semibold ${getStatusTextColor(m.status)}`}>{m.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 pt-4">
                    <div className="overflow-hidden rounded-2xl border border-[#d8c7a5]/75 bg-white/88 shadow-[0_12px_28px_rgba(76,93,128,0.12)]">
                      <div className="flex flex-col gap-2 border-b border-[#e1d3b8] bg-gradient-to-r from-[#1f3f7a] via-[#2f5b97] to-[#b07f31] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#fff3dc]">Summary Report</h3>
                        <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-[#355583]">Rank Scope: Class + Section</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[690px] text-[12px] sm:text-[13px]">
                          <thead>
                            <tr className="bg-[#f4ead5] text-[#4e3618]">
                              <th className="border border-[#e0d3b8] px-3 py-2.5 text-left font-semibold">Metric</th>
                              {visibleTerminals.map((t) => (
                                <th key={t} className="border border-[#e0d3b8] px-3 py-2.5 text-center font-semibold">{t} Term</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="transition-colors hover:bg-[#f2f8ff]">
                              <td className="border border-[#e8dcc2] px-3 py-2.5 font-semibold text-[#1f2f46]">Total Marks</td>
                              {visibleTerminals.map((t) => (
                                <td key={t} className="border border-[#e8dcc2] px-3 py-2.5 text-center font-medium text-[#2a3d59]">
                                  {getSummaryCellValue(t, termSummaries[t]?.total_max_marks)}
                                </td>
                              ))}
                            </tr>
                            <tr className="bg-[#fffbf2] transition-colors hover:bg-[#f2f8ff]">
                              <td className="border border-[#e8dcc2] px-3 py-2.5 font-semibold text-[#1f2f46]">Marks Obtained</td>
                              {visibleTerminals.map((t) => (
                                <td key={t} className="border border-[#e8dcc2] px-3 py-2.5 text-center font-semibold text-[#1f406f]">
                                  {getSummaryCellValue(t, termSummaries[t]?.total_obtained)}
                                </td>
                              ))}
                            </tr>
                            <tr className="transition-colors hover:bg-[#f2f8ff]">
                              <td className="border border-[#e8dcc2] px-3 py-2.5 font-semibold text-[#1f2f46]">Percentage</td>
                              {visibleTerminals.map((t) => (
                                <td key={t} className={`border border-[#e8dcc2] px-3 py-2.5 text-center font-semibold ${getDivisionColor(termSummaries[t]?.division)}`}>
                                  {getSummaryCellValue(
                                    t,
                                    typeof termSummaries[t]?.percentage !== 'undefined' && termSummaries[t]?.percentage !== null
                                      ? `${termSummaries[t].percentage}%`
                                      : '--'
                                  )}
                                </td>
                              ))}
                            </tr>
                            <tr className="bg-[#fffbf2] transition-colors hover:bg-[#f2f8ff]">
                              <td className="border border-[#e8dcc2] px-3 py-2.5 font-semibold text-[#1f2f46]">Division</td>
                              {visibleTerminals.map((t) => (
                                <td key={t} className={`border border-[#e8dcc2] px-3 py-2.5 text-center font-semibold ${getDivisionColor(termSummaries[t]?.division)}`}>
                                  {getSummaryCellValue(t, termSummaries[t]?.division)}
                                </td>
                              ))}
                            </tr>
                            <tr className="transition-colors hover:bg-[#f2f8ff]">
                              <td className="border border-[#e8dcc2] px-3 py-2.5 font-semibold text-[#1f2f46]">Class &amp; Section Rank</td>
                              {visibleTerminals.map((t) => (
                                <td key={t} className="border border-[#e8dcc2] px-3 py-2.5 text-center font-semibold text-[#2b456f]">
                                  {getDisplayRank(t)}
                                </td>
                              ))}
                            </tr>
                            <tr className="bg-[#fffbf2] transition-colors hover:bg-[#f2f8ff]">
                              <td className="border border-[#e8dcc2] px-3 py-2.5 font-semibold text-[#1f2f46]">Published Date</td>
                              {visibleTerminals.map((t) => {
                                const publishedDate = getPublishedDateFromSummary(termSummaries[t])
                                return (
                                  <td key={t} className="border border-[#e8dcc2] px-3 py-2.5 text-center font-medium text-[#2a3d59]">
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
                    <div className="grid grid-cols-1 gap-5 rounded-2xl border border-[#d8c7a5]/75 bg-gradient-to-br from-white to-[#f6eddc] px-4 py-4 shadow-[0_12px_28px_rgba(76,93,128,0.12)] sm:px-5 sm:py-5 lg:grid-cols-[minmax(0,1fr)_230px]">
                      <div>
                        <p className="mb-3 text-center text-base font-semibold uppercase tracking-[0.08em] text-[#5f421d] lg:text-left">Important Information</p>
                        <ul className="space-y-2 text-[12px] text-[#3f5168] sm:text-[13px]">
                          <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#8d6428]"></span><span>This is a computer-generated result marksheet and does not require any signature.</span></li>
                          <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#8d6428]"></span><span>The details shown here are based on official school records.</span></li>
                          <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#8d6428]"></span><span>Any discrepancy should be reported within 7 days of result declaration.</span></li>
                          <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#8d6428]"></span><span><strong>AB</strong> denotes absent and <strong>NA</strong> denotes not applicable.</span></li>
                          <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#8d6428]"></span><span>Pass Marks: 30 for regular subjects and 15 for Drawing.</span></li>
                          <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#8d6428]"></span><span>Drawing is evaluated only by External marks (FM: 50).</span></li>
                          <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#8d6428]"></span><span>Rank displayed above is calculated class and section wise.</span></li>
                        </ul>
                      </div>

                      <div className="flex flex-col justify-between">
                        <div className="rounded-xl border border-[#d8c7a6] bg-[#fff7e8] px-3 py-2 text-center">
                          <p className="text-[11px] font-semibold uppercase text-[#6d4b1f]">Generated On</p>
                          <p className="text-sm font-semibold text-[#233650]">{todayLabel}</p>
                        </div>
                        <div className="mt-6 text-center">
                          <div className="h-12 border-b-2 border-[#8b97ac]"></div>
                          <p className="mt-2 text-sm font-semibold text-[#233650]">Principal&apos;s Signature &amp; Stamp</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#d8c8a8] px-4 pb-5 pt-3 text-center text-[11px] font-semibold text-[#5a4324] sm:px-6">
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
