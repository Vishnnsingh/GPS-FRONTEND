import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'
import { aboutPhotos, homeFeaturePhotos } from '../../assets/websiteImages'

function ResultField({ label, name, icon, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
        {label}
        {required ? ' *' : ''}
      </span>
      <div className="relative">
        <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        {children(name)}
      </div>
    </label>
  )
}

function ResultLogin() {
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
      <section className="ryme-section pt-8">
        <div className="ryme-shell">
          <div className="ryme-grid lg:grid-cols-[1.03fr_0.97fr]">
            <article className="ryme-card p-6 sm:p-8">
              <span className="ryme-tag">Result Portal</span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                View your result instantly with student details
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">
                Enter class, roll number and terminal to open the published result. Optional section and session fields
                help narrow records quickly.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="ryme-card-soft p-3">
                  <p className="text-2xl font-extrabold text-cyan-100">100%</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-300">Online Access</p>
                </div>
                <div className="ryme-card-soft p-3">
                  <p className="text-2xl font-extrabold text-cyan-100">24/7</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-300">Availability</p>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-cyan-200/25">
                <img
                  src={homeFeaturePhotos[2] || aboutPhotos.secondary}
                  alt="Students checking result"
                  className="h-64 w-full object-cover sm:h-72"
                />
              </div>
            </article>

            <article className="ryme-card p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Result Login</h2>
              <p className="mt-2 text-sm text-slate-300">Fill student details to continue.</p>

              {error ? (
                <div className="mt-4 rounded-xl border border-red-300/40 bg-red-400/15 p-3">
                  <p className="text-sm text-red-100">{error}</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <ResultField label="Class" name="classValue" icon="groups" required>
                  {(name) => (
                    <input
                      name={name}
                      value={formData.classValue}
                      onChange={handleChange}
                      className="ryme-input pl-11"
                      placeholder="e.g. 1"
                      type="text"
                      inputMode="numeric"
                      required
                    />
                  )}
                </ResultField>

                <ResultField label="Roll No" name="roll" icon="badge" required>
                  {(name) => (
                    <input
                      name={name}
                      value={formData.roll}
                      onChange={handleChange}
                      className="ryme-input pl-11"
                      placeholder="e.g. 17"
                      type="text"
                      inputMode="numeric"
                      required
                    />
                  )}
                </ResultField>

                <ResultField label="Terminal" name="terminal" icon="event" required>
                  {(name) => (
                    <select name={name} value={formData.terminal} onChange={handleChange} className="ryme-input pl-11" required>
                      {terminals.map((terminal) => (
                        <option key={terminal} value={terminal}>
                          {terminal}
                        </option>
                      ))}
                    </select>
                  )}
                </ResultField>

                <ResultField label="Section (optional)" name="section" icon="grid_view">
                  {(name) => (
                    <input
                      name={name}
                      value={formData.section}
                      onChange={handleChange}
                      className="ryme-input pl-11"
                      placeholder="e.g. A"
                      type="text"
                    />
                  )}
                </ResultField>

                <ResultField label="Session (optional)" name="session" icon="calendar_month">
                  {(name) => (
                    <input
                      name={name}
                      value={formData.session}
                      onChange={handleChange}
                      className="ryme-input pl-11"
                      placeholder="e.g. 2025-26"
                      type="text"
                    />
                  )}
                </ResultField>

                <button type="submit" className="ryme-button mt-2 w-full">
                  View Result
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-slate-300">
                Admin/Teacher login?{' '}
                <Link to="/login" className="font-bold text-cyan-200 hover:text-cyan-100">
                  Go to Login
                </Link>
              </p>
            </article>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  )
}

export default ResultLogin
