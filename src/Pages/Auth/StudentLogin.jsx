import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { emitToast, login, setSession } from '../../Api/auth'

function StudentLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    rollNumber: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#101922] text-slate-900 dark:text-slate-100" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        {/* Left Side: Visual Anchor */}
        <div className="relative hidden lg:flex lg:w-5/12 xl:w-1/2 bg-[#137fec] items-center justify-center p-6 overflow-hidden">
          {/* Decorative Background Pattern */}
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
              <span className="text-white text-lg font-bold tracking-tight">EduPortal</span>
            </div>

            <h1 className="text-white text-2xl xl:text-3xl font-black leading-tight mb-4">
              Welcome Back to Your Digital Campus.
            </h1>

            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Access your personalized learning dashboard, track your progress, and stay connected with your academic journey.
            </p>

            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
              <div 
                className="w-full aspect-video bg-cover bg-center" 
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80')"
                }}
              ></div>
            </div>
          </div>

          {/* Abstract floating elements */}
          <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex flex-col justify-center items-center py-4 px-4 lg:px-8 xl:px-12 bg-white dark:bg-[#101922] overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2 mb-4 text-[#137fec]">
              <span className="material-symbols-outlined text-xl">school</span>
              <span className="text-base font-bold">EduPortal</span>
            </div>

            <div className="mb-4">
              <h2 className="text-[#0d141b] dark:text-white text-xl font-black leading-tight tracking-tight">
                Student Login
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs">
                Enter your credentials to access your account.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Roll Number */}
              <div className="relative group">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                  Roll Number
                </label>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                  <span className="material-symbols-outlined pl-2 text-slate-400 text-base">badge</span>
                  <input
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder="Enter your roll number"
                    type="text"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative group">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                  Password
                </label>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                  <span className="material-symbols-outlined pl-2 text-slate-400 text-base">lock</span>
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                    placeholder="Enter your password"
                    type="password"
                    required
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3 h-3 rounded border-slate-300 text-[#137fec] focus:ring-[#137fec]"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400">Remember me</span>
                </label>
                <a href="#" className="text-xs text-[#137fec] font-medium hover:underline">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold py-2 rounded-lg shadow-lg shadow-[#137fec]/20 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-base">sync</span>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <span>Log In</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center pt-2">
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-[#137fec] font-bold hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer Small */}
          <div className="mt-4 text-slate-400 text-xs">
            © 2024 EduPortal School Management System. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentLogin
