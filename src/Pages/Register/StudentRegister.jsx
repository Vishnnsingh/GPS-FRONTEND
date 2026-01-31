import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function StudentRegister() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    rollNumber: '',
    class: 'Grade 9',
    section: 'Section A',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy')
      return
    }
    console.log('Form Data:', formData)
    alert('Registration successful!')
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
              Unlock Your Future with Our Digital Campus.
            </h1>

            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Join thousands of students who are already shaping their careers through our integrated learning platform. Fast, secure, and intuitive enrollment.
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

        {/* Right Side: Registration Form */}
        <div className="flex-1 flex flex-col justify-center items-center py-4 px-4 lg:px-8 xl:px-12 bg-white dark:bg-[#101922] overflow-y-auto">
          <div className="w-full max-w-xl">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2 mb-4 text-[#137fec]">
              <span className="material-symbols-outlined text-xl">school</span>
              <span className="text-base font-bold">EduPortal</span>
            </div>

            <div className="mb-4">
              <h2 className="text-[#0d141b] dark:text-white text-xl font-black leading-tight tracking-tight">
                Student Enrollment
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs">
                Enter the student's details to begin the registration process.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Section: Personal Info */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#137fec]/80 mb-2">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* First Name */}
                  <div className="relative group">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                      First Name
                    </label>
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                      <span className="material-symbols-outlined pl-2 text-slate-400 text-base">person</span>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="John"
                        type="text"
                        required
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="relative group">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                      Last Name
                    </label>
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                      <span className="material-symbols-outlined pl-2 text-slate-400 text-base">person</span>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="Doe"
                        type="text"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Parents Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="relative group">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                      Father's Name
                    </label>
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                      <span className="material-symbols-outlined pl-2 text-slate-400 text-base">family_restroom</span>
                      <input
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="Enter father's name"
                        type="text"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                      Mother's Name
                    </label>
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                      <span className="material-symbols-outlined pl-2 text-slate-400 text-base">family_restroom</span>
                      <input
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="Enter mother's name"
                        type="text"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* DOB */}
                <div className="relative group">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                    Date of Birth
                  </label>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                    <span className="material-symbols-outlined pl-2 text-slate-400 text-base">calendar_month</span>
                    <input
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                      type="date"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section: Academic Info */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#137fec]/80 mb-2">
                  Academic Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="relative group">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                      Roll Number
                    </label>
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                      <input
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="Ex: 10234"
                        type="text"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                      Class
                    </label>
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                      <select
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white"
                        required
                      >
                        <option>Grade 9</option>
                        <option>Grade 10</option>
                        <option>Grade 11</option>
                        <option>Grade 12</option>
                      </select>
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                      Section
                    </label>
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                      <select
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white"
                        required
                      >
                        <option>Section A</option>
                        <option>Section B</option>
                        <option>Section C</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Security */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#137fec]/80 mb-2">
                  Security
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                        placeholder="••••••••"
                        type="password"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                      Confirm Password
                    </label>
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
                      <span className="material-symbols-outlined pl-2 text-slate-400 text-base">lock_reset</span>
                      <input
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="••••••••"
                        type="password"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Submit */}
              <div className="pt-3 space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-0.5 w-3 h-3 rounded border-slate-300 text-[#137fec] focus:ring-[#137fec]"
                    type="checkbox"
                    required
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    I agree to the{' '}
                    <a className="text-[#137fec] font-medium hover:underline" href="#">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a className="text-[#137fec] font-medium hover:underline" href="#">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold py-2 rounded-lg shadow-lg shadow-[#137fec]/20 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <span>Register Student</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>

                <div className="text-center pt-2">
                  <p className="text-slate-600 dark:text-slate-400 text-xs">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#137fec] font-bold hover:underline">
                      Log In
                    </Link>
                  </p>
                </div>
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

export default StudentRegister
