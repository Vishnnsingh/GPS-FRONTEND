import React, { useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import logo from '../Assets/logo.jpeg';

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
    <header className="sticky top-0 z-40">
      {/* Top Bar */}
      <div className="bg-[#0d141b] text-white">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-white/80">
            <span className="hidden sm:inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">call</span>
              +91 00000 00000
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">mail</span>
              info@school.edu
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/result-login"
              className="inline-flex items-center gap-1 text-xs font-bold text-white/90 hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">award_star</span>
              Result Portal
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-[#137fec] hover:bg-[#137fec]/90 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="bg-white/85 dark:bg-[#101922]/85 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <img
  src={logo}
  alt="School Logo"
  className="h-10 w-10 object-contain rounded-xl bg-white p-1 shadow-sm"
/>

            <div className="min-w-0">
              <p className="text-sm font-black leading-tight truncate">{SCHOOL_NAME}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight truncate">
                School Website
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={`text-sm font-bold px-3 py-2 rounded-lg transition-colors ${
                  isActive(l.to)
                    ? 'bg-[#137fec]/10 text-[#137fec]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Mobile dropdown */}
        {open ? (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101922]">
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-bold px-3 py-2 rounded-lg ${
                    isActive(l.to)
                      ? 'bg-[#137fec]/10 text-[#137fec]'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {l.label}
                </Link>
              ))}

              <div className="pt-2 flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 text-sm font-black px-3 py-2 rounded-lg bg-[#137fec] text-white hover:bg-[#137fec]/90"
                >
                  <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default WebsiteHeader


