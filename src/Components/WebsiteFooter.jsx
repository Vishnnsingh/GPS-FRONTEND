import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

function WebsiteFooter() {
  const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'
  const year = new Date().getFullYear()

  const quickLinks = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About' },
      { to: '/gallery', label: 'Gallery' },
      { to: '/contact', label: 'Contact' },
      { to: '/login', label: 'Admin Login' },
    ],
    []
  )

  return (
    <footer className="mt-10 bg-[#0d141b] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-[#137fec] flex items-center justify-center">
              <span className="material-symbols-outlined">school</span>
            </div>
            <div>
              <p className="text-base font-black leading-tight">{SCHOOL_NAME}</p>
              <p className="text-xs text-white/70 leading-tight">Learning • Discipline • Growth</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-white/70 max-w-xl">
            We provide a safe, modern and student-focused environment with strong academics,
            co-curricular activities and value-based education.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-white/10">
              <span className="material-symbols-outlined text-sm">verified</span>
              CBSE Pattern
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-white/10">
              <span className="material-symbols-outlined text-sm">science</span>
              Smart Labs
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-white/10">
              <span className="material-symbols-outlined text-sm">sports_soccer</span>
              Sports & Activities
            </span>
          </div>
        </div>

        <div>
          <p className="text-sm font-black">Quick Links</p>
          <div className="mt-3 flex flex-col gap-2">
            {quickLinks.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-white/70 hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-black">Contact</p>
          <div className="mt-3 space-y-2 text-sm text-white/70">
            <p className="flex items-start gap-2">
              <span className="material-symbols-outlined text-base">location_on</span>
              <span>School Road, Your City, State - 000000</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">call</span>
              <span>+91 00000 00000</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">mail</span>
              <span>info@school.edu</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/60">© {year} {SCHOOL_NAME}. All rights reserved.</p>
          <p className="text-xs text-white/60">Powered by EduPortal</p>
        </div>
      </div>
    </footer>
  )
}

export default WebsiteFooter


