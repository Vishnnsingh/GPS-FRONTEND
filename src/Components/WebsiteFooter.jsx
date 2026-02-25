import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { sharedImages } from '../assets/websiteImages'

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
    <footer className="mt-16 border-t border-cyan-200/15 bg-[#040c16]/85">
      <div className="ryme-shell py-12">
        <div className="ryme-card p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-cyan-200/35 bg-white/90 p-1.5">
                  <img
                    src={sharedImages.schoolLogo}
                    alt={`${SCHOOL_NAME} logo`}
                    className="h-11 w-11 rounded-lg object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{SCHOOL_NAME}</h3>
                  <p className="text-xs uppercase tracking-[0.16em] text-cyan-100/70">Learning | Discipline | Growth</p>
                </div>
              </div>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-200">
                Student-first campus with modern classrooms, strong academics, activities, and transparent digital systems
                for students, parents, teachers and admin teams.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {['Smart Classes', 'Labs', 'Sports', 'Safe Campus'].map((tag) => (
                  <span key={tag} className="ryme-tag !text-[0.64rem] !tracking-[0.15em]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <h4 className="text-base font-bold text-white">Explore</h4>
              <div className="mt-3 flex flex-col gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="inline-flex w-fit items-center gap-1.5 text-sm text-slate-200 hover:text-cyan-100"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <h4 className="text-base font-bold text-white">Reach Us</h4>
              <div className="mt-3 space-y-2.5 text-sm text-slate-200">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 hover:text-cyan-100"
                >
                  <span className="material-symbols-outlined text-base text-cyan-300">location_on</span>
                  <span>Belaspur Dainmanwa Road, Harinagar, West Champaran, Bihar 845103</span>
                </a>
                <a href="tel:+917870225302" className="inline-flex items-center gap-2 hover:text-cyan-100">
                  <span className="material-symbols-outlined text-base text-cyan-300">call</span>
                  +91 7870225302
                </a>
                <a href="mailto:gpschool2025@gmail.com" className="inline-flex items-center gap-2 hover:text-cyan-100">
                  <span className="material-symbols-outlined text-base text-cyan-300">mail</span>
                  gpschool2025@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
          <p>
            (c) {year} <span className="font-semibold text-slate-300">{SCHOOL_NAME}</span>. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-1.5">
            <img src={sharedImages.websiteTechIcon} alt="Technology" className="h-4 w-4" />
            Powered by EduPortal
          </p>
        </div>
      </div>
    </footer>
  )
}

export default WebsiteFooter
