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
    <footer className="mt-16 bg-linear-to-b from-[#0d141b] to-[#050a0f] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* School Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl overflow-hidden border border-white/20 bg-white shadow-lg shadow-[#137fec]/30">
                <img
                  src={sharedImages.schoolLogo}
                  alt={`${SCHOOL_NAME} logo`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black leading-tight text-white">{SCHOOL_NAME}</h3>
                <p className="text-xs sm:text-sm text-white/70 leading-tight font-medium">
                  Learning | Discipline | Growth
                </p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-white/75 max-w-xl leading-relaxed mb-6">
              We provide a safe, modern and student-focused environment with strong academics,
              co-curricular activities and value-based education. Committed to nurturing future leaders
              through excellence in teaching and holistic development.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {[
                { icon: 'verified', label: 'CBSE Pattern' },
                { icon: 'science', label: 'Smart Labs' },
                { icon: 'sports_soccer', label: 'Sports & Activities' },
                { icon: 'security', label: 'Safe Campus' },
              ].map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200 cursor-default"
                >
                  <span className="material-symbols-outlined text-sm">{badge.icon}</span>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-black mb-4 text-white">Quick Links</h4>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-2 group w-fit"
                >
                  <span className="material-symbols-outlined text-base opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                    arrow_forward
                  </span>
                  <span>{l.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-black mb-4 text-white">Contact Us</h4>
            <div className="space-y-3 text-sm text-white/75">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-white transition-colors duration-200 group"
              >
                <span className="material-symbols-outlined text-lg text-[#137fec] group-hover:scale-110 transition-transform">
                  location_on
                </span>
                <span className="leading-relaxed">
                  School Road, Your City,<br />
                  State - 000000
                </span>
              </a>
              <a
                href="tel:+910000000000"
                className="flex items-center gap-3 hover:text-white transition-colors duration-200 group"
              >
                <span className="material-symbols-outlined text-lg text-[#137fec] group-hover:scale-110 transition-transform">
                  call
                </span>
                <span>+91 00000 00000</span>
              </a>
              <a
                href="mailto:info@school.edu"
                className="flex items-center gap-3 hover:text-white transition-colors duration-200 group"
              >
                <span className="material-symbols-outlined text-lg text-[#137fec] group-hover:scale-110 transition-transform">
                  mail
                </span>
                <span>info@school.edu</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10 bg-[#050a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-white/60 text-center sm:text-left">
              (c) {year} <span className="font-semibold">{SCHOOL_NAME}</span>. All rights reserved.
            </p>
            <div className="text-xs sm:text-sm text-white/60 text-center sm:text-right inline-flex items-center gap-1.5">
              <img src={sharedImages.websiteTechIcon} alt="Technology" className="h-4 w-4 opacity-90" />
              <span>
                Powered by <span className="font-semibold text-white/80">EduPortal</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default WebsiteFooter




