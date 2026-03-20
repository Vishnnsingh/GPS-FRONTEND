import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'

function ResultsPortal() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'
  const navigate = useNavigate()
  const terminals = useMemo(() => ['First', 'Second', 'Third', 'Annual'], [])

  const [formData, setFormData] = useState({
    classValue: '',
    roll: '',
    terminal: 'First',
    section: '',
    session: '',
  })

  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

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
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fcff_0%,#eff6fb_50%,#f7fafc_100%)]">
        <section className="relative overflow-hidden py-12 md:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(14,165,233,0.08),transparent_42%,rgba(15,118,110,0.08))]"></div>

          <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-sky-50/90 px-4 py-1.5 text-cyan-700">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span className="text-xs font-bold uppercase tracking-[0.18em]">Secure Portal</span>
              </div>

              <h1 className="mb-4 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
                View Your <span className="text-cyan-700">Results</span>
              </h1>

              <p className="mb-6 text-lg leading-relaxed text-slate-600">
                Access your academic performance with just a few details. Check your marks, division, and percentage
                instantly.
              </p>

              <div className="mb-8 grid grid-cols-3 gap-4">
                {[
                  { icon: 'check_circle', label: 'Instant', desc: 'Real-time results' },
                  { icon: 'security', label: 'Secure', desc: 'Safe access' },
                  { icon: 'trending_up', label: 'Track', desc: 'Performance' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-slate-200 bg-white/92 p-3 shadow-sm shadow-slate-200/40"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-xl text-cyan-700">{item.icon}</span>
                      <p className="text-sm font-bold text-slate-900">{item.label}</p>
                    </div>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-[linear-gradient(90deg,rgba(14,165,233,0.16),transparent)] blur-2xl"></div>

              <div className="relative rounded-2xl border border-slate-200 bg-white/94 p-8 shadow-xl shadow-slate-300/30">
                <h2 className="mb-6 text-2xl font-black text-slate-900">Enter Your Details</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      <span className="material-symbols-outlined mr-1 align-middle text-sm text-cyan-700">school</span>
                      Class
                    </label>
                    <input
                      type="text"
                      name="classValue"
                      value={formData.classValue}
                      onChange={handleChange}
                      placeholder="e.g., 1, 2, 10, 12, UKG"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-all focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      <span className="material-symbols-outlined mr-1 align-middle text-sm text-cyan-700">badge</span>
                      Roll Number
                    </label>
                    <input
                      type="number"
                      name="roll"
                      value={formData.roll}
                      onChange={handleChange}
                      placeholder="Enter your roll number"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-all focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      <span className="material-symbols-outlined mr-1 align-middle text-sm text-cyan-700">calendar_today</span>
                      Terminal/Exam
                    </label>
                    <select
                      name="terminal"
                      value={formData.terminal}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-all focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                    >
                      {terminals.map((terminal) => (
                        <option key={terminal} value={terminal}>
                          {terminal} Terminal
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      <span className="material-symbols-outlined mr-1 align-middle text-sm text-cyan-700">layers</span>
                      Section <span className="text-xs text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      placeholder="e.g., A, B, C"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-all focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      <span className="material-symbols-outlined mr-1 align-middle text-sm text-cyan-700">calendar_month</span>
                      Session <span className="text-xs text-slate-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="session"
                      value={formData.session}
                      onChange={handleChange}
                      placeholder="e.g., 2025-26"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-all focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100"
                    />
                  </div>

                  {error ? (
                    <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
                      <span className="material-symbols-outlined mt-0.5 flex-shrink-0 text-xl text-red-600">error</span>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#0f172a_0%,#155e75_100%)] px-4 py-2.5 font-bold text-white shadow-lg shadow-slate-900/15 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/18"
                  >
                    <span className="material-symbols-outlined text-sm">search</span>
                    View My Result
                  </button>
                </form>

                <div className="mt-6 border-t border-slate-200 pt-6 text-center">
                  <p className="mb-3 text-xs text-slate-500">Questions? Need help accessing your result?</p>
                  <Link to="/contact" className="inline-flex items-center gap-1 text-sm font-bold text-cyan-700 hover:underline">
                    <span className="material-symbols-outlined text-sm">call</span>
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl border-t border-slate-200 px-4 py-16">
          <h2 className="mb-12 text-center text-3xl font-black text-slate-900">Features</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: 'timeline',
                title: 'Subject-wise Marks',
                desc: 'View detailed marks for each subject including external and internal assessments',
              },
              {
                icon: 'percent',
                title: 'Performance Analytics',
                desc: 'Track your percentage, division, and overall performance at a glance',
              },
              {
                icon: 'print',
                title: 'Printable Results',
                desc: 'Download and print your result card for official use',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-white/92 p-6 shadow-lg shadow-slate-200/30 transition-all hover:border-cyan-200 hover:shadow-slate-300/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50">
                  <span className="material-symbols-outlined text-cyan-700">{feature.icon}</span>
                </div>
                <h3 className="mb-2 text-lg font-black text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto my-8 max-w-4xl rounded-xl border border-cyan-100 bg-cyan-50/65 px-4 py-12 shadow-sm shadow-cyan-100/60">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined flex-shrink-0 text-2xl text-cyan-700">info</span>
            <div>
              <h3 className="mb-2 font-bold text-slate-900">How to Access Your Results</h3>
              <ol className="list-inside list-decimal space-y-1 text-sm text-slate-700">
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
