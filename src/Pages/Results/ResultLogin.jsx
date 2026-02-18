import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function ResultLogin() {
  const navigate = useNavigate()

  const terminals = useMemo(() => ['First', 'Second', 'Third', 'Annual'], [])

  const [formData, setFormData] = useState({
    classValue: '',
    roll: '',
    terminal: 'First',
    section: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.classValue || !formData.roll || !formData.terminal) {
      setError('Please fill Class, Roll No and Terminal.')
      return
    }

    const params = new URLSearchParams()
    params.set('class', String(formData.classValue).trim())
    params.set('roll', String(formData.roll).trim())
    params.set('terminal', String(formData.terminal).trim())
    if (String(formData.section).trim()) params.set('section', String(formData.section).trim())

    navigate(`/result?${params.toString()}`)
  }

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-[#101922] text-slate-900 dark:text-slate-100"
      style={{ fontFamily: "'Lexend', sans-serif" }}
    >
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        {/* Left Side */}
        <div className="relative hidden lg:flex lg:w-5/12 xl:w-1/2 bg-[#137fec] items-center justify-center p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"></rect>
            </svg>
          </div>

          <div className="relative z-10 flex flex-col items-start max-w-lg">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-white p-1.5 rounded-xl text-[#137fec]">
                <span className="material-symbols-outlined text-xl">school</span>
              </div>
              <span className="text-white text-lg font-bold tracking-tight">Result Portal</span>
            </div>

            <h1 className="text-white text-2xl xl:text-3xl font-black leading-tight mb-4">
              View Your Result Instantly.
            </h1>

            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Enter your class, roll number, terminal and section to fetch the published result.
            </p>

            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
              <div
                className="w-full aspect-video bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80')",
                }}
              ></div>
            </div>
          </div>

          <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col justify-center items-center py-4 px-4 lg:px-8 xl:px-12 bg-white dark:bg-[#101922] overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center gap-2 mb-4 text-[#137fec]">
              <span className="material-symbols-outlined text-xl">school</span>
              <span className="text-base font-bold">Result Portal</span>
            </div>

            <div className="mb-4">
              <h2 className="text-[#0d141b] dark:text-white text-xl font-black leading-tight tracking-tight">
                Result Login
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs">
                Fill student details to open result page (dashboard nahi).
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Class */}
              <div className="relative group">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                  Class
                </label>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                  <span className="material-symbols-outlined pl-2 text-slate-400 text-base">groups</span>
                  <input
                    name="classValue"
                    value={formData.classValue}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder="e.g. 1"
                    type="text"
                    inputMode="numeric"
                    required
                  />
                </div>
              </div>

              {/* Roll No */}
              <div className="relative group">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                  Roll No
                </label>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                  <span className="material-symbols-outlined pl-2 text-slate-400 text-base">badge</span>
                  <input
                    name="roll"
                    value={formData.roll}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder="e.g. 1"
                    type="text"
                    inputMode="numeric"
                    required
                  />
                </div>
              </div>

              {/* Terminal */}
              <div className="relative group">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                  Terminal
                </label>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                  <span className="material-symbols-outlined pl-2 text-slate-400 text-base">event</span>
                  <select
                    name="terminal"
                    value={formData.terminal}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none focus:ring-0 py-2 px-2 text-sm text-slate-900 dark:text-white"
                    required
                  >
                    {terminals.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section (optional) */}
              <div className="relative group">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                  Section (optional)
                </label>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                  <span className="material-symbols-outlined pl-2 text-slate-400 text-base">grid_view</span>
                  <input
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder="e.g. A"
                    type="text"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold py-2 rounded-lg shadow-lg shadow-[#137fec]/20 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <span>View Result</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  Admin/Teacher login?{' '}
                  <Link to="/login" className="text-[#137fec] font-bold hover:underline">
                    Go to Login
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="mt-4 text-slate-400 text-xs">© 2024 EduPortal School Management System.</div>
        </div>
      </div>
    </div>
  )
}

export default ResultLogin


