import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WebsiteLayout from '../../Components/Website/WebsiteLayout'
import { aboutPhotos, homeFeaturePhotos } from '../../assets/websiteImages'
import { useResultSearchOptions } from './useResultSearchOptions'

function ResultField({ label, name, icon, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
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
  const {
    classOptions,
    sectionOptions,
    sessionOptions,
    recentSessionOptions,
    olderSessionOptions,
    loading: loadingSearchOptions,
    error: searchOptionsError,
  } = useResultSearchOptions(formData.classValue)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => {
      if (name === 'classValue') {
        return {
          ...prev,
          classValue: value,
          section: '',
        }
      }

      return { ...prev, [name]: value }
    })
    setError('')
  }

  useEffect(() => {
    if (formData.section && !sectionOptions.includes(formData.section)) {
      setFormData((prev) => ({ ...prev, section: '' }))
    }
  }, [formData.section, sectionOptions])

  useEffect(() => {
    const nextDefaultSession = sessionOptions[0] || ''
    if (!nextDefaultSession) {
      if (formData.session) {
        setFormData((prev) => ({ ...prev, session: '' }))
      }
      return
    }

    if (!formData.session || !sessionOptions.includes(formData.session)) {
      setFormData((prev) => ({ ...prev, session: nextDefaultSession }))
    }
  }, [formData.session, sessionOptions])

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
      <section className="gps-section pt-8">
        <div className="gps-shell">
          <div className="gps-grid lg:grid-cols-[1.03fr_0.97fr]">
            <article className="gps-auth-card p-6 sm:p-8">
              <span className="gps-auth-tag">Result Portal</span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
                View your result instantly with student details
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                Enter class, roll number and terminal to open the published result. Optional section and session fields
                help narrow records quickly.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="gps-auth-card-soft p-3">
                  <p className="text-2xl font-extrabold text-sky-700">100%</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Online Access</p>
                </div>
                <div className="gps-auth-card-soft p-3">
                  <p className="text-2xl font-extrabold text-sky-700">24/7</p>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Availability</p>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-sky-100">
                <img
                  src={homeFeaturePhotos[2] || aboutPhotos.secondary}
                  alt="Students checking result"
                  className="h-64 w-full object-cover sm:h-72"
                />
              </div>
            </article>

            <article className="gps-auth-card p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Result Login</h2>
              <p className="mt-2 text-sm text-slate-600">Fill student details to continue.</p>

              {error ? (
                <div className="mt-4 rounded-xl border border-red-300/40 bg-red-50 p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <ResultField label="Class" name="classValue" icon="groups" required>
                  {(name) => (
                    <select
                      name={name}
                      value={formData.classValue}
                      onChange={handleChange}
                      className="gps-input gps-auth-input pl-11"
                      disabled={loadingSearchOptions}
                      required
                    >
                      <option value="">
                        {loadingSearchOptions ? 'Loading classes...' : classOptions.length > 0 ? 'Select class' : 'No classes found'}
                      </option>
                      {classOptions.map((classValue) => (
                        <option key={classValue} value={classValue}>
                          {classValue}
                        </option>
                      ))}
                    </select>
                  )}
                </ResultField>

                <ResultField label="Roll No" name="roll" icon="badge" required>
                  {(name) => (
                    <input
                      name={name}
                      value={formData.roll}
                      onChange={handleChange}
                      className="gps-input gps-auth-input pl-11"
                      placeholder="e.g. 17"
                      type="text"
                      inputMode="numeric"
                      required
                    />
                  )}
                </ResultField>

                <ResultField label="Terminal" name="terminal" icon="event" required>
                  {(name) => (
                    <select
                      name={name}
                      value={formData.terminal}
                      onChange={handleChange}
                      className="gps-input gps-auth-input pl-11"
                      required
                    >
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
                    <select
                      name={name}
                      value={formData.section}
                      onChange={handleChange}
                      className="gps-input gps-auth-input pl-11"
                      disabled={!formData.classValue || loadingSearchOptions}
                    >
                      <option value="">
                        {!formData.classValue
                          ? 'Select class first'
                          : loadingSearchOptions
                            ? 'Loading sections...'
                            : sectionOptions.length > 0
                              ? 'All sections'
                              : 'No sections found'}
                      </option>
                      {sectionOptions.map((sectionValue) => (
                        <option key={sectionValue} value={sectionValue}>
                          {sectionValue}
                        </option>
                      ))}
                    </select>
                  )}
                </ResultField>

                <ResultField label="Session (optional)" name="session" icon="calendar_month">
                  {(name) => (
                    <select
                      name={name}
                      value={formData.session}
                      onChange={handleChange}
                      className="gps-input gps-auth-input pl-11"
                      disabled={loadingSearchOptions}
                    >
                      {sessionOptions.length === 0 ? (
                        <option value="">
                          {loadingSearchOptions ? 'Loading sessions...' : 'No sessions found'}
                        </option>
                      ) : (
                        <>
                          {recentSessionOptions.length > 0 ? (
                            <optgroup label="Recent Sessions">
                              {recentSessionOptions.map((sessionValue) => (
                                <option key={sessionValue} value={sessionValue}>
                                  {sessionValue}
                                </option>
                              ))}
                            </optgroup>
                          ) : null}
                          {olderSessionOptions.length > 0 ? (
                            <optgroup label="Older Sessions">
                              {olderSessionOptions.map((sessionValue) => (
                                <option key={sessionValue} value={sessionValue}>
                                  {sessionValue}
                                </option>
                              ))}
                            </optgroup>
                          ) : null}
                        </>
                      )}
                    </select>
                  )}
                </ResultField>

                {searchOptionsError ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                    <p className="text-xs text-amber-700">{searchOptionsError}</p>
                  </div>
                ) : null}

                <button type="submit" className="gps-auth-button mt-2 w-full">
                  View Result
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-slate-500">
                Admin/Teacher login?{' '}
                <Link to="/login" className="font-bold text-sky-700 hover:text-sky-800">
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
