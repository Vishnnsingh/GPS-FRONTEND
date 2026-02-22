import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'

function ResultsPortal() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'GJ Public School'
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    classValue: '',
    roll: '',
    terminal: 'First',
    section: '',
    session: '',
  })

  const [error, setError] = useState('')

  const terminals = useMemo(() => ['First', 'Second', 'Third', 'Annual'], [])

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
    if (String(formData.session).trim()) params.set('session', String(formData.session).trim())

    navigate(`/result?${params.toString()}`)
  }

  return (
    <WebsiteLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-[#101922]">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-[#137fec]/10 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#137fec]/10 text-[#137fec] rounded-full px-4 py-1.5 mb-4 border border-[#137fec]/20">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span className="text-xs font-bold">Secure Portal</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-[#0d141b] dark:text-white mb-4 leading-tight">
                View Your <span className="text-[#137fec]">Results</span>
              </h1>

              <p className="text-slate-600 dark:text-slate-300 text-lg mb-6 leading-relaxed">
                Access your academic performance with just a few details. Check your marks, division, and percentage instantly.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: 'check_circle', label: 'Instant', desc: 'Real-time results' },
                  { icon: 'security', label: 'Secure', desc: 'Safe access' },
                  { icon: 'trending_up', label: 'Track', desc: 'Performance' },
                ].map((item) => (
                  <div key={item.label} className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[#137fec] text-xl">{item.icon}</span>
                      <p className="font-bold text-sm text-[#0d141b] dark:text-white">{item.label}</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-linear-to-r from-[#137fec]/20 to-transparent blur-2xl rounded-2xl"></div>
              
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-2xl font-black text-[#0d141b] dark:text-white mb-6">Enter Your Details</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Class Input */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      <span className="material-symbols-outlined text-sm align-middle mr-1">school</span>
                      Class
                    </label>
                    <input
                      type="text"
                      name="classValue"
                      value={formData.classValue}
                      onChange={handleChange}
                      placeholder="e.g., 1, 2, 10, 12, UKG"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#137fec] transition-all"
                      required
                    />
                  </div>

                  {/* Roll Number Input */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      <span className="material-symbols-outlined text-sm align-middle mr-1">badge</span>
                      Roll Number
                    </label>
                    <input
                      type="number"
                      name="roll"
                      value={formData.roll}
                      onChange={handleChange}
                      placeholder="Enter your roll number"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#137fec] transition-all"
                      required
                    />
                  </div>

                  {/* Terminal Select */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      <span className="material-symbols-outlined text-sm align-middle mr-1">calendar_today</span>
                      Terminal/Exam
                    </label>
                    <select
                      name="terminal"
                      value={formData.terminal}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#137fec] transition-all"
                    >
                      {terminals.map((t) => (
                        <option key={t} value={t}>
                          {t} Terminal
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Section Input (Optional) */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      <span className="material-symbols-outlined text-sm align-middle mr-1">layers</span>
                      Section <span className="text-xs text-slate-500 dark:text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      placeholder="e.g., A, B, C"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#137fec] transition-all"
                    />
                  </div>

                  {/* Session Input (Optional) */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      <span className="material-symbols-outlined text-sm align-middle mr-1">calendar_month</span>
                      Session <span className="text-xs text-slate-500 dark:text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="session"
                      value={formData.session}
                      onChange={handleChange}
                      placeholder="e.g., 2025-26"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#137fec] transition-all"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-3">
                      <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl flex-shrink-0 mt-0.5">error</span>
                      <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#137fec]/30"
                  >
                    <span className="material-symbols-outlined text-sm">search</span>
                    View My Result
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    Questions? Need help accessing your result?
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1 text-sm font-bold text-[#137fec] hover:underline"
                  >
                    <span className="material-symbols-outlined text-sm">call</span>
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-4 py-16 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-black text-center text-[#0d141b] dark:text-white mb-12">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: 'timeline',
                title: 'Subject-wise Marks',
                desc: 'View detailed marks for each subject including external and internal assessments'
              },
              {
                icon: 'percent',
                title: 'Performance Analytics',
                desc: 'Track your percentage, division, and overall performance at a glance'
              },
              {
                icon: 'print',
                title: 'Printable Results',
                desc: 'Download and print your result card for official use'
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-[#137fec]/50 dark:hover:border-[#137fec]/30 transition-all"
              >
                <div className="bg-[#137fec]/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[#137fec]">{feature.icon}</span>
                </div>
                <h3 className="font-black text-lg text-[#0d141b] dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Info Section */}
        <section className="max-w-4xl mx-auto px-4 py-12 bg-[#137fec]/5 dark:bg-[#137fec]/10 rounded-xl border border-[#137fec]/20 my-8">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-[#137fec] text-2xl flex-shrink-0">info</span>
            <div>
              <h3 className="font-bold text-[#0d141b] dark:text-white mb-2">How to Access Your Results</h3>
              <ol className="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-decimal list-inside">
                <li>Enter your class number exactly as provided in school records</li>
                <li>Provide your roll number</li>
                <li>Select the appropriate terminal/exam period</li>
                <li>Section and session are optional - include if applicable</li>
                <li>Click "View My Result" to see your marks and performance</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </WebsiteLayout>
  )
}

export default ResultsPortal
