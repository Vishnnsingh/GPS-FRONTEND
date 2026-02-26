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

  const whatsappNumber = '7870225302'
  const whatsappUrl = `https://wa.me/91${whatsappNumber}`

  return (
    <footer className="relative mt-16 border-t border-cyan-200/15 bg-[#040c16]/85">
      {/* WhatsApp Floating Button - Right Corner */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/50 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/60 active:scale-95"
        aria-label="Contact us on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="h-7 w-7"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

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
            {/* <img src={sharedImages.websiteTechIcon} alt="Technology" className="h-4 w-4" /> */}
            Powered by Kavion Innovation
          </p>
        </div>
      </div>
    </footer>
  )
}

export default WebsiteFooter
