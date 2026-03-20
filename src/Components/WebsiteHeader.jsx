import React, { useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

function WebsiteHeader() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'
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

  const linkClass = ({ isActive }) =>
    `rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
      isActive
        ? 'bg-[#c79843]/18 text-[#6f4b19] ring-1 ring-[#c79843]/45'
        : 'text-[#334766] hover:bg-[#f2e8d5] hover:text-[#1f2d45]'
    }`

  return (
    <header className="fixed inset-x-0 top-0 z-[90]">
      <div className="gps-header-shell">
        <div className="rounded-[1.75rem] border border-[#d8c7a6]/70 bg-white/90 px-4 sm:px-5 shadow-[0_10px_30px_rgba(118,94,56,0.14)] backdrop-blur-md">
          <div className="flex min-h-[4.5rem] items-center justify-between gap-3 py-2 sm:min-h-[4.75rem]">
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <div className="rounded-xl border border-[#c79843]/45 bg-white/95 p-1.5 shadow-[0_6px_20px_rgba(151,111,43,0.25)]">
                <img
                  src={logo}
                  alt={`${SCHOOL_NAME} Logo`}
                  className="h-11 w-11 rounded-lg object-cover sm:h-12 sm:w-12"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-[#9d7a41] sm:text-xs">
                  Digital Campus
                </p>
                <h1 className="truncate text-sm font-bold text-[#1f2d45] sm:text-base">{SCHOOL_NAME}</h1>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/results-portal"
                className="inline-flex items-center justify-center rounded-xl border border-[#c79843]/50 px-3 py-2 text-xs font-semibold text-[#6f4b19] hover:bg-[#f6eddc]"
              >
                Result
              </Link>
              <Link to="/login" className="gps-button !px-4 !py-2 !text-sm">
                Admin Panel
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#c79843]/45 text-[#8b6832] md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
            </button>
          </div>

          {open && (
            <div className="border-t border-[#c79843]/35 py-3 md:hidden">
              <div className="flex flex-col gap-1.5">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={linkClass}
                    end={link.to === '/'}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Link
                    to="/results-portal"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-xl border border-[#c79843]/45 px-3 py-2 text-sm font-semibold text-[#6f4b19]"
                  >
                    Result
                  </Link>
                  <Link to="/login" onClick={() => setOpen(false)} className="gps-button !py-2 !text-sm">
                    Admin
                  </Link>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Call: +91 7870225302 | Email: gpschool2025@gmail.com
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default WebsiteHeader
