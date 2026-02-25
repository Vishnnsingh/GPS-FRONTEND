import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { emitToast, login, setSession } from '../../Api/auth'
import WebsiteFooter from '../../Components/WebsiteFooter'
import WebsiteHeader from '../../Components/WebsiteHeader'
import { homeFeaturePhotos } from '../../assets/websiteImages'

function StudentLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    rollNumber: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(formData.rollNumber, formData.password)
      const userRole = response?.user?.role
      const loginType = userRole === 'student' ? 'student' : 'all'
      setSession(response, loginType)

      if (userRole && userRole !== 'student') {
        emitToast('warning', 'Non-student account detected. Redirecting to standard dashboard.', 'Role Notice')
      } else {
        emitToast('success', 'Student login successful', 'Welcome')
      }

      navigate('/dashboard')
    } catch (err) {
      const message = err?.message || 'Student login failed. Please verify credentials.'
      setError(message)
      emitToast('error', message, 'Login Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen ryme-page text-slate-100">
      <WebsiteHeader />
      <main className="pb-10 pt-[92px] sm:pt-[98px]">
        <div className="ryme-shell">
          <div className="ryme-grid lg:grid-cols-[1fr_1fr]">
            <article className="ryme-card p-6 sm:p-8">
              <span className="ryme-tag">Student Portal</span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Student dashboard login for results and records
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">
                Log in with roll number and password to access your personal result view and academic information.
              </p>

              <div className="mt-6 overflow-hidden rounded-2xl border border-cyan-200/25">
                <img
                  src={homeFeaturePhotos[1] || homeFeaturePhotos[0]}
                  alt="Students in school activity"
                  className="h-64 w-full object-cover sm:h-72"
                />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: 'Profile', value: 'Personal' },
                  { label: 'Results', value: 'Fast' },
                  { label: 'Access', value: 'Secure' },
                ].map((item) => (
                  <div key={item.label} className="ryme-card-soft p-3">
                    <p className="text-sm font-bold text-cyan-100">{item.value}</p>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-slate-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="ryme-card p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Student Login</h2>
              <p className="mt-2 text-sm text-slate-300">Enter credentials to continue.</p>

              {error ? (
                <div className="mt-4 rounded-xl border border-red-300/40 bg-red-400/15 p-3">
                  <p className="text-sm text-red-100">{error}</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                    Roll Number
                  </span>
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      badge
                    </span>
                    <input
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      className="ryme-input pl-11"
                      placeholder="Enter your roll number"
                      type="text"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">Password</span>
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      lock
                    </span>
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="ryme-input pl-11"
                      placeholder="Enter your password"
                      type="password"
                      required
                    />
                  </div>
                </label>

                <div className="flex items-center justify-between pt-1">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                    <input type="checkbox" className="h-4 w-4 rounded border-cyan-300/50 bg-transparent" />
                    Remember me
                  </label>
                  <a href="#" className="text-sm font-semibold text-cyan-200 hover:text-cyan-100">
                    Forgot Password?
                  </a>
                </div>

                <button type="submit" disabled={loading} className="ryme-button mt-2 w-full disabled:opacity-60">
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-base">sync</span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      Log In
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-slate-300">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-cyan-200 hover:text-cyan-100">
                  Sign Up
                </Link>
              </p>
            </article>
          </div>
        </div>
      </main>
      <WebsiteFooter />
    </div>
  )
}

export default StudentLogin
