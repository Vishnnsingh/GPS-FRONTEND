import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getStudentResultPublic } from '../../Api/marks'
import '../../styles/print.css'

function Results() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'
  const SCHOOL_ADDRESS = import.meta.env.VITE_SCHOOL_ADDRESS || 'Bilaspur Dainmarwa Road, Harinagar (W. Champaran)'

  const [searchParams] = useSearchParams()

  const params = useMemo(() => {
    const classValue = searchParams.get('class') || ''
    const roll = searchParams.get('roll') || ''
    const terminal = searchParams.get('terminal') || ''
    const section = searchParams.get('section') || ''
    return { classValue, roll, terminal, section }
  }, [searchParams])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  // Holds summaries for each terminal fetched (e.g., { First: {...}, Second: {...} })
  const [termSummaries, setTermSummaries] = useState({})
  // Terminals we will show columns for based on selected terminal
  const [visibleTerminals, setVisibleTerminals] = useState([]) 

  useEffect(() => {
    const run = async () => {
      setError('')

      if (!params.classValue || !params.roll || !params.terminal) {
        setData(null)
        setTermSummaries({})
        setVisibleTerminals([])
        setError('Missing params. Please go back and fill Class, Roll and Terminal.')
        return
      }

      setLoading(true)

      // Ordered list - extend if you have other terminal names in your system
      const orderedTerminals = ['First', 'Second', 'Third', 'Final', 'Annual']

      // Determine which terminals to show (all up to & including selected terminal)
      const idx = orderedTerminals.indexOf(params.terminal)
      const terminalsToFetch = idx >= 0 ? orderedTerminals.slice(0, idx + 1) : [params.terminal]

      try {
        // Fetch summaries for each terminal in parallel
        const responses = await Promise.all(terminalsToFetch.map(async (t) => {
          try {
            const res = await getStudentResultPublic({ ...params, terminal: t })
            return { terminal: t, data: res }
          } catch (e) {
            // If not found or unpublished, return null to indicate missing
            return { terminal: t, data: null }
          }
        }))

        const summaries = {}
        let currentData = null

        responses.forEach(r => {
          if (r.data?.summary) summaries[r.terminal] = r.data.summary
          else summaries[r.terminal] = null

          // Keep the full data for the terminal the user is currently viewing
          if (r.terminal === params.terminal) {
            currentData = r.data
          }
        })

        setTermSummaries(summaries)
        setVisibleTerminals(terminalsToFetch)

        // If we have full result for current terminal, set it; otherwise fallback to null
        if (currentData) {
          setData(currentData)
        } else {
          setData(null)
          // Only show an error if current terminal fetch failed; earlier terminals can be missing
          setError('Result for this terminal is not available or not published yet.')
        }
      } catch (err) {
        setData(null)
        setTermSummaries({})
        setVisibleTerminals([])
        setError(err?.message || 'Failed to fetch result')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [params])

  const student = data?.student
  const marks = Array.isArray(data?.marks) ? data.marks : []
  const summary = data?.summary

  const handlePrint = () => {
    window.print()
  }

  const getPercentageColor = (percentage) => {
    const percent = parseFloat(percentage)
    if (percent >= 90) return 'from-green-500 to-emerald-600'
    if (percent >= 80) return 'from-blue-500 to-cyan-600'
    if (percent >= 70) return 'from-purple-500 to-pink-600'
    if (percent >= 60) return 'from-amber-500 to-orange-600'
    return 'from-red-500 to-rose-600'
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

  // Calculate rank (1-based). Prefer summary.rank, fall back to top-level if present
  const calculateRank = () => {
    const r = data?.summary?.rank ?? data?.rank
    // If it's a numeric string like "1", convert to number. If non-numeric, return as-is.
    if (typeof r === 'number' && !isNaN(r)) return r
    if (typeof r === 'string' && r.trim() !== '' && !isNaN(Number(r))) return Number(r)
    return r ? r : 'N/A'
  }

  const getRankPosition = () => {
    const rank = calculateRank()
    if (typeof rank !== 'number') return 'th'
    const mod100 = rank % 100
    if (mod100 >= 11 && mod100 <= 13) return 'th'
    switch (rank % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }

  // Helper to get suffix for any numeric rank
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

  // Use the term-based summary for the current terminal if available
  const currentSummary = termSummaries[params.terminal] ?? summary

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#101922] text-slate-900 dark:text-slate-100" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Top Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#101922]/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#137fec] text-white rounded-xl p-2 shadow-sm">
              <span className="material-symbols-outlined text-base">school</span>
            </div>
            <div>
              <p className="text-sm font-black leading-tight">{SCHOOL_NAME}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Student Result</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/results-portal"
              className="text-xs font-bold text-[#137fec] hover:underline"
            >
              New Result
            </Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            {data && (
              <>
                <button
                  onClick={handlePrint}
                  className="text-xs font-bold text-[#137fec] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">print</span>
                  Print
                </button>
                <span className="text-slate-300 dark:text-slate-700">|</span>
              </>
            )}
            <Link
              to="/login"
              className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:underline"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* Query Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#137fec]">badge</span>
              <div>
                <p className="text-sm font-black">Class {params.classValue || '--'} • Roll {params.roll || '--'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Terminal: <span className="font-bold">{params.terminal || '--'}</span>
                  {params.section ? (
                    <>
                      {' '}
                      • Section: <span className="font-bold">{params.section}</span>
                    </>
                  ) : null}
                </p>
              </div>
            </div>
            {currentSummary?.status ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#137fec]/10 text-[#137fec]">
                <span className="material-symbols-outlined text-sm">verified</span>
                {currentSummary.status}
              </span>
            ) : null}
          </div>
        </div>

        {/* States */}
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
            {/* Result Card - Professional Design */}
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-500 overflow-hidden shadow-2xl result-print print-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
              {/* Header Section */}
              <div className="border-b-2 border-slate-400 dark:border-slate-500 p-4 bg-linear-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 print:p-3">
                <div className="flex items-start gap-4">
                  {/* Logo - Left Side */}
                  <div className="shrink-0">
                    <div className="h-16 w-16 rounded-lg bg-[#137fec]/15 flex items-center justify-center border border-[#137fec]/30 print:h-14 print:w-14">
                      <span className="material-symbols-outlined text-3xl text-[#137fec] print:text-2xl">school</span>
                    </div>
                  </div>
                  
                  {/* Header Text - Center */}
                  <div className="flex-1 text-center">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight print:text-xl">{SCHOOL_NAME}</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 print:text-xs">{SCHOOL_ADDRESS}</p>
                    <p className="text-xs font-bold text-[#137fec] mt-1 uppercase tracking-wide print:text-xs print:mt-0.5">
                      {data.terminal} Terminal Examination Result Card
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 border-b-2 border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 print:grid-cols-2">
                <div className="p-4 border-r border-slate-200 dark:border-slate-700 print:p-3 print:border-r-2 print:border-slate-400">
                  <div className="grid grid-cols-2 gap-4 text-sm print:grid-cols-2 print:gap-3 print:text-xs">
                    <div>
                      <p className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Student Name</p>
                      <p className="text-slate-900 dark:text-white font-black text-base mt-1 print:text-sm">{student?.name || '--'}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Father Name</p>
                      <p className="text-slate-900 dark:text-white font-bold mt-1 print:text-sm">{student?.father_name || '--'}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Class</p>
                      <p className="text-slate-900 dark:text-white font-black text-lg mt-1 print:text-base">{student?.class ?? params.classValue}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Roll No</p>
                      <p className="text-slate-900 dark:text-white font-black text-lg mt-1 print:text-base">{student?.roll_no ?? params.roll}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 print:p-3">
                  <div className="grid grid-cols-2 gap-4 text-sm print:grid-cols-2 print:gap-3 print:text-xs">
                    <div>
                      <p className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Section</p>
                      <p className="text-slate-900 dark:text-white font-bold mt-1 print:text-sm">{(student?.section ?? params.section) || '--'}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Year</p>
                      <p className="text-slate-900 dark:text-white font-bold mt-1 print:text-sm">{new Date().getFullYear()}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-bold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wide">Current Terminal</p>
                      <p className="text-[#137fec] dark:text-blue-400 font-black text-lg mt-1 print:text-base">{data?.terminal || params.terminal}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marks Table */}
              <div className="p-4 border-b-2 border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 print:p-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wide print:text-xs print:mb-2">Subject Marks</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs print:text-xs">
                    <thead>
                      <tr className="bg-slate-900 dark:bg-slate-950 text-white border-2 border-slate-400 dark:border-slate-500">
                        <th className="border border-slate-400 dark:border-slate-500 px-3 py-2.5 text-left font-bold print:px-2 print:py-2">Subject</th>
                        <th className="border border-slate-400 dark:border-slate-500 px-2 py-2.5 text-center font-bold print:px-2 print:py-2">Max</th>
                        <th className="border border-slate-400 dark:border-slate-500 px-2 py-2.5 text-center font-bold print:px-2 print:py-2">Ext</th>
                        <th className="border border-slate-400 dark:border-slate-500 px-2 py-2.5 text-center font-bold print:px-2 print:py-2">Int</th>
                        <th className="border border-slate-400 dark:border-slate-500 px-3 py-2.5 text-center font-bold print:px-2 print:py-2">Obtained</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marks.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-6 text-slate-600 dark:text-slate-400">No marks available</td>
                        </tr>
                      )}

                      {marks.map((m, idx) => {
                        // Use nullish coalescing so zero values are shown correctly
                        const obtained = m?.total_obtained ?? '--'
                        const isAbsent = m?.total_obtained === 'AB'
                        return (
                          <tr key={`${m?.code || 'SUB'}-${idx}`} className="border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-900/50 transition-colors">
                            <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 font-bold text-slate-900 dark:text-white print:px-2 print:py-1.5">{m?.subject || '--'}</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-2 py-2 text-center text-slate-700 dark:text-slate-300 print:px-2 print:py-1.5">{m?.max_marks ?? '--'}</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-2 py-2 text-center text-slate-700 dark:text-slate-300 print:px-2 print:py-1.5">{m?.external_marks ?? '--'}</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-2 py-2 text-center text-slate-700 dark:text-slate-300 print:px-2 print:py-1.5">{m?.internal_marks ?? '--'}</td>
                            <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-center font-bold print:px-2 print:py-1.5">
                              <span className={`${isAbsent ? 'text-red-600 dark:text-red-400 font-black' : 'text-green-600 dark:text-green-400 font-black'}`}>
                                {obtained}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Details Section - All Terminals */}
              <div className="p-4 border-b-2 border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 print:p-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wide print:text-xs print:mb-2">Summary Report</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs print:text-xs">
                    <thead>
                      <tr className="bg-slate-900 dark:bg-slate-950 text-white border-2 border-slate-400 dark:border-slate-500">
                        <th className="border border-slate-400 dark:border-slate-500 px-3 py-2.5 text-left font-bold print:px-2 print:py-2">Metric</th>
                        {visibleTerminals.map((t) => (
                          <th key={t} className="border border-slate-400 dark:border-slate-500 px-3 py-2.5 text-center font-bold print:px-2 print:py-2">{t}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Total Marks Row */}
                      <tr className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/30 hover:bg-blue-50 dark:hover:bg-slate-900/50">
                        <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 font-bold text-slate-900 dark:text-white print:px-2 print:py-1.5">Total Marks</td>
                        {visibleTerminals.map((t) => (
                          <td key={t} className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-center text-slate-700 dark:text-slate-300 font-bold print:px-2 print:py-1.5">{termSummaries[t]?.total_max_marks ?? '--'}</td>
                        ))}
                      </tr>

                      {/* Marks Obtained Row */}
                      <tr className="border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-900/50">
                        <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 font-bold text-slate-900 dark:text-white print:px-2 print:py-1.5">Marks Obtained</td>
                        {visibleTerminals.map((t) => (
                          <td key={t} className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-center font-bold text-green-600 dark:text-green-400 print:px-2 print:py-1.5">{termSummaries[t]?.total_obtained ?? '--'}</td>
                        ))}
                      </tr>

                      {/* Percentage Row */}
                      <tr className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/30 hover:bg-blue-50 dark:hover:bg-slate-900/50">
                        <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 font-bold text-slate-900 dark:text-white print:px-2 print:py-1.5">Percentage</td>
                        {visibleTerminals.map((t) => (
                          <td key={t} className={`border border-slate-300 dark:border-slate-600 px-3 py-2 text-center font-black ${getDivisionColor(termSummaries[t]?.division)} print:px-2 print:py-1.5`}>
                            {typeof termSummaries[t]?.percentage !== 'undefined' && termSummaries[t]?.percentage !== null ? `${termSummaries[t].percentage}%` : '--'}
                          </td>
                        ))}
                      </tr>

                      {/* Division Row */}
                      <tr className="border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-900/50">
                        <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 font-bold text-slate-900 dark:text-white print:px-2 print:py-1.5">Division</td>
                        {visibleTerminals.map((t) => (
                          <td key={t} className={`border border-slate-300 dark:border-slate-600 px-3 py-2 text-center font-bold ${getDivisionColor(termSummaries[t]?.division)} print:px-2 print:py-1.5`}>{termSummaries[t]?.division ?? '--'}</td>
                        ))}
                      </tr>

                      {/* Rank Row */}
                      <tr className="border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/30 hover:bg-blue-50 dark:hover:bg-slate-900/50">
                        <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 font-bold text-slate-900 dark:text-white print:px-2 print:py-1.5">Rank (Top 10)</td>
                        {visibleTerminals.map((t) => (
                          <td key={t} className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-center font-bold text-blue-600 dark:text-blue-400 print:px-2 print:py-1.5">
                            {typeof termSummaries[t]?.rank !== 'undefined' && termSummaries[t]?.rank !== null ? (isNaN(Number(termSummaries[t].rank)) ? termSummaries[t].rank : `${Number(termSummaries[t].rank)}${getRankSuffixFor(Number(termSummaries[t].rank))}`) : '--'}
                          </td>
                        ))}
                      </tr>

                      {/* Published Date Row */}
                      <tr className="border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-900/50">
                        <td className="border border-slate-300 dark:border-slate-600 px-3 py-2 font-bold text-slate-900 dark:text-white print:px-2 print:py-1.5">Published Date</td>
                        {visibleTerminals.map((t) => (
                          <td key={t} className="border border-slate-300 dark:border-slate-600 px-3 py-2 text-center font-bold text-slate-700 dark:text-slate-300 print:px-2 print:py-1.5">
                            {termSummaries[t]?.published_date ? new Date(termSummaries[t].published_date).toLocaleDateString('en-IN') : '--'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes Section */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border-b-2 border-slate-400 dark:border-slate-500 text-xs text-slate-600 dark:text-slate-400 print:p-3 print:text-xs">
                <p className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wide print:mb-1">Important Notes:</p>
                <ul className="space-y-1 list-disc list-inside text-xs print:space-y-0.5 print:text-xs">
                  <li>This is a computer-generated result marksheet</li>
                  <li><strong>AB</strong> denotes Absent; <strong>NA</strong> denotes Not Applicable</li>
                  <li>Any discrepancy should be reported within 7 days</li>
                  <li>Please verify the information and contact the school if there are any errors</li>
                </ul>
              </div>

              {/* Signature Section */}
              <div className="p-4 flex items-end justify-between bg-white dark:bg-slate-800 border-t-2 border-slate-400 dark:border-slate-500 print:p-3">
                <div className="text-center">
                  <div className="h-16 w-28 border-t-2 border-slate-400 dark:border-slate-500 mb-2 print:h-12 print:w-24 print:mb-1"></div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide print:text-xs">Student/Parent</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase tracking-wide print:mb-1 print:text-xs">Date</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-bold print:text-xs">{new Date().toLocaleDateString('en-IN')}</p>
                </div>
                <div className="text-center">
                  <div className="h-16 w-28 border-t-2 border-slate-400 dark:border-slate-500 mb-2 print:h-12 print:w-24 print:mb-1"></div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide print:text-xs">Principal</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-4 no-print">
              © {new Date().getFullYear()} {SCHOOL_NAME}. Result portal.
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Results