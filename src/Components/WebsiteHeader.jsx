import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { schoolProfile, siteMedia, siteNavLinks } from '../Pages/Website/siteContent'
import { scrollToPageTop } from '../utils/scrollToPageTop'

function WebsiteHeader() {
  const [open, setOpen] = useState(false)

  const handleSiteNavigation = () => {
    setOpen(false)
    scrollToPageTop()
  }

  const linkClass = ({ isActive }) =>
    `relative inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 after:pointer-events-none after:absolute after:bottom-[6px] after:left-4 after:right-4 after:h-[2px] after:origin-center after:rounded-full after:bg-[linear-gradient(90deg,#06b6d4,#0f172a)] after:transition-transform after:duration-300 after:content-[''] ${
      isActive
        ? 'text-slate-950 after:scale-x-100'
        : 'text-slate-600 after:scale-x-0 hover:-translate-y-[1px] hover:bg-white/80 hover:text-slate-900 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] hover:after:scale-x-100'
    }`

  const resultLinkClass =
    'inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-[1px] hover:border-cyan-200 hover:bg-white/85 hover:text-slate-900 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]'

  return (
    <header className="fixed inset-x-0 top-0 z-[120]">
      <div className="gps-site-shell">
        <div className="mt-4 rounded-[1.9rem] border border-[var(--site-border)] bg-[rgba(255,255,255,0.82)] px-4 py-3 shadow-[0_24px_60px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:px-6">
          <div className="flex min-h-[4.5rem] items-center justify-between gap-3">
            <Link to="/" className="flex min-w-0 items-center gap-3" onClick={handleSiteNavigation}>
              <div className="rounded-[1.2rem] border border-slate-200 bg-white p-2 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
                <img src={siteMedia.logo} alt={`${schoolProfile.name} logo`} className="h-11 w-11 rounded-xl object-cover sm:h-12 sm:w-12" />
              </div>
              <div className="min-w-0">
                {/* <p className="truncate text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-700 sm:text-xs">
                  School ERP Campus
                </p> */}
                <h1 className="truncate text-sm font-extrabold text-slate-900 sm:text-base">{schoolProfile.name}</h1>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {siteNavLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'} onClick={handleSiteNavigation}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <Link
                to="/results-portal"
                className={resultLinkClass}
                onClick={handleSiteNavigation}
              >
                Result
              </Link>
              <Link to="/admission" className="gps-site-button-secondary !rounded-full !px-4 !py-2 !text-sm" onClick={handleSiteNavigation}>
                Admission
              </Link>
              <Link to="/login" className="gps-site-button !rounded-full !px-4 !py-2 !text-sm" onClick={handleSiteNavigation}>
                Admin
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
            </button>
          </div>

          {open && (
            <div className="border-t border-slate-200 py-4 lg:hidden">
              <div className="flex flex-col gap-1.5">
                {siteNavLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={linkClass}
                    end={link.to === '/'}
                    onClick={handleSiteNavigation}
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <Link
                    to="/results-portal"
                    onClick={handleSiteNavigation}
                    className={`${resultLinkClass} px-3`}
                  >
                    Result
                  </Link>
                  <Link to="/admission" onClick={handleSiteNavigation} className="gps-site-button-secondary !rounded-full !py-2 !text-sm">
                    Admission
                  </Link>
                  <Link to="/login" onClick={handleSiteNavigation} className="gps-site-button !rounded-full !py-2 !text-sm">
                    Admin
                  </Link>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  {schoolProfile.phone} | {schoolProfile.email}
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
