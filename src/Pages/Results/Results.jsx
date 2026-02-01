import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getStudentResultPublic } from '../../Api/marks'

function Results() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'GJ Public School'

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

  useEffect(() => {
    const run = async () => {
      setError('')

      if (!params.classValue || !params.roll || !params.terminal) {
        setData(null)
        setError('Missing params. Please go back and fill Class, Roll and Terminal.')
        return
      }

      setLoading(true)
      try {
        const res = await getStudentResultPublic(params)
        setData(res)
      } catch (err) {
        setData(null)
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
              to="/result-login"
              className="text-xs font-bold text-[#137fec] hover:underline"
            >
              Change Details
            </Link>
            <span className="text-slate-300 dark:text-slate-700">|</span>
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
            {summary?.status ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#137fec]/10 text-[#137fec]">
                <span className="material-symbols-outlined text-sm">verified</span>
                {summary.status}
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

        {!loading && !error && data ? (
          <>
            {/* Student Card + Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#137fec] to-[#0d5bb8] text-white flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div>
                      <p className="text-lg font-black leading-tight">{student?.name || 'Student'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Father: <span className="font-bold text-slate-700 dark:text-slate-200">{student?.father_name || '--'}</span>
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200">
                          Class: {student?.class ?? params.classValue}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200">
                          Roll: {student?.roll_no ?? params.roll}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200">
                          Section: {(student?.section ?? params.section) || '--'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-[#137fec]/10 text-[#137fec]">
                          Terminal: {data?.terminal || params.terminal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#137fec] to-[#0d5bb8] rounded-xl p-5 text-white shadow-lg">
                <p className="text-xs opacity-90">Overall Performance</p>
                <div className="flex items-end justify-between gap-2 mt-1">
                  <p className="text-3xl font-black">{summary?.percentage ?? '--'}%</p>
                  <span className="material-symbols-outlined text-5xl opacity-30">emoji_events</span>
                </div>
                <div className="mt-2 text-xs opacity-90">
                  <p>
                    Total: <span className="font-bold">{summary?.total_obtained ?? '--'}</span> /{' '}
                    <span className="font-bold">{summary?.total_max_marks ?? '--'}</span>
                  </p>
                  <p>
                    Division: <span className="font-bold">{summary?.division ?? '--'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Marks Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <p className="text-sm font-black">Marks Details</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Subjects: <span className="font-bold">{marks.length}</span>
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Max
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        External
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Internal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {marks.map((m, idx) => (
                      <tr key={`${m?.code || 'SUB'}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                        <td className="px-4 py-3 text-sm font-bold text-slate-900 dark:text-white">
                          {m?.subject || '--'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{m?.code || '--'}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{m?.max_marks ?? '--'}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{m?.external_marks ?? '--'}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{m?.internal_marks ?? '--'}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-[#137fec]/10 text-[#137fec]">
                            {m?.total_obtained ?? '--'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-2">
              © 2024 {SCHOOL_NAME}. Result portal.
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Results