import React, { useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../assets/logo.jpeg';

function WebsiteHeader() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const links = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About' },
      { to: '/gallery', label: 'Gallery' },
      { to: '/contact', label: 'Contact' },
    ],
    []
  )

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false
    return location.pathname === path
  }

  return (
    <header className="sticky top-0 z-50">
      
      {/* ================= TOP BAR ================= */}
      <div className="bg-[#0d141b] text-white border-b border-white/5">
        <div className="w-full">
          <div className="flex items-center justify-between h-10 gap-4 px-4 sm:px-6 lg:px-8">
            
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <a
                href="tel:+91 7870225302"
                className="hidden sm:inline-flex items-center gap-1.5 text-white/70 hover:text-white/90 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">call</span>
                <span>+91 7870225302</span>
              </a>

              <a
                href="mailto:gpschool2025@gmail.com"
                className="inline-flex items-center gap-1.5 text-white/70 hover:text-white/90 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">mail</span>
                <span className="hidden sm:inline">gpschool2025@gmail.com</span>
                <span className="sm:hidden">Email</span>
              </a>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/result-login"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/80 hover:text-white px-2.5 sm:px-3 py-1 rounded-md hover:bg-white/5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">award_star</span>
                <span className="hidden sm:inline">Result Portal</span>
                <span className="sm:hidden">Results</span>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-md bg-[#137fec]/80 hover:bg-[#137fec] text-white transition-colors"
              >
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                <span className="hidden sm:inline">Admin Login</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN NAVIGATION ================= */}
      <div className="bg-white dark:bg-[#101922] border-b border-slate-200 dark:border-slate-800">
        <div className="w-full">
          <div className="flex items-center justify-between h-16 gap-4 px-4 sm:px-6 lg:px-8">
            
            {/* Logo & School Name */}
            <Link
              to="/"
              className="flex items-center gap-3 min-w-0 flex-1"
            >
              <img
                src={logo}
                alt={`${SCHOOL_NAME} Logo`}
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-lg bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700"
              />

              {/* ✅ FIXED PART: School Name visible on mobile */}
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-bold leading-tight text-[#0d141b] dark:text-white truncate">
                  {SCHOOL_NAME}
                </h1>

                {/* Hide subtitle on mobile */}
                <p className="hidden sm:block text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-tight truncate">
                  Your growth, our commitment.
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                    isActive(l.to)
                      ? 'text-[#137fec] dark:text-[#4da3ff]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">
                {open ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101922]">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4 space-y-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`block text-sm font-medium px-4 py-2.5 rounded-md transition-colors ${
                    isActive(l.to)
                      ? 'text-[#137fec] dark:text-[#4da3ff]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {l.label}
                </Link>
              ))}

              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-md bg-[#137fec] text-white hover:bg-[#137fec]/90 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default WebsiteHeader