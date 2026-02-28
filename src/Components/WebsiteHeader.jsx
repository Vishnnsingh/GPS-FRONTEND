import React, { useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.jpeg'

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
        ? 'bg-cyan-300/18 text-cyan-50 ring-1 ring-cyan-300/45'
        : 'text-slate-200 hover:bg-slate-100/10 hover:text-white'
    }`

  return (
    <header className="fixed inset-x-0 top-0 z-[90]">
      <div className="ryme-shell py-3">
        <div className="ryme-glass rounded-2xl px-3 sm:px-4">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <div className="rounded-xl border border-cyan-200/35 bg-white/95 p-1.5">
                <img
                  src={logo}
                  alt={`${SCHOOL_NAME} Logo`}
                  className="h-9 w-9 rounded-lg object-cover sm:h-10 sm:w-10"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100/85 sm:text-xs">
                  Digital Campus
                </p>
                <h1 className="truncate text-sm font-bold text-white sm:text-base">{SCHOOL_NAME}</h1>
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
                className="inline-flex items-center justify-center rounded-xl border border-cyan-300/35 px-3 py-2 text-xs font-semibold text-cyan-50 hover:bg-cyan-300/10"
              >
                Result
              </Link>
              <Link to="/login" className="ryme-button !px-4 !py-2 !text-sm">
                Admin Panel
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-200/30 text-cyan-100 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
            </button>
          </div>

          {open && (
            <div className="border-t border-cyan-200/20 py-3 md:hidden">
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
                    className="inline-flex items-center justify-center rounded-xl border border-cyan-300/35 px-3 py-2 text-sm font-semibold text-cyan-50"
                  >
                    Result
                  </Link>
                  <Link to="/login" onClick={() => setOpen(false)} className="ryme-button !py-2 !text-sm">
                    Admin
                  </Link>
                </div>
                <p className="mt-2 text-xs text-slate-300">
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
