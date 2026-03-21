import React from 'react'
import { Link } from 'react-router-dom'
import { schoolProfile, siteMedia, siteNavLinks } from '../Pages/Website/siteContent'
import { scrollToPageTop } from '../utils/scrollToPageTop'

function WebsiteFooter() {
  const year = new Date().getFullYear()
  const handleSiteNavigation = () => {
    scrollToPageTop()
  }

  return (
    <footer className="relative mt-8 border-t border-[var(--site-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.3),rgba(255,255,255,0.84))]">
      <a
        href={schoolProfile.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-[110] inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 sm:px-4"
        aria-label="Contact us on WhatsApp"
      >
        <span className="material-symbols-outlined text-lg">chat</span>
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      <div className="gps-site-shell py-14">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.75fr_0.9fr]">
          <div className="gps-site-panel p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-[1.2rem] border border-slate-200 bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <img src={siteMedia.logo} alt={`${schoolProfile.name} logo`} className="h-14 w-14 rounded-xl object-cover sm:h-16 sm:w-16" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{schoolProfile.name}</h3>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-700">Calm campus, clear systems, steady growth</p>
              </div>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {schoolProfile.tagline} The website is intentionally kept clear and text-led so families can find the right
              information quickly without unnecessary clutter.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {['Admissions guidance', 'Result access', 'Parent communication', 'Student-first routine'].map((tag) => (
                <span key={tag} className="gps-site-chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="gps-site-panel-muted p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Explore</p>
            <div className="mt-4 flex flex-col gap-2.5">
              {siteNavLinks.concat([{ to: '/login', label: 'Admin Login' }]).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={handleSiteNavigation}
                  className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  <span className="material-symbols-outlined text-base text-cyan-700">arrow_forward</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="gps-site-panel-muted p-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Reach us</p>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <a href={schoolProfile.mapsHref} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-slate-900">
                <span className="material-symbols-outlined mt-0.5 text-cyan-700">location_on</span>
                <span>{schoolProfile.address}</span>
              </a>
              <a href={schoolProfile.phoneHref} className="flex items-center gap-3 hover:text-slate-900">
                <span className="material-symbols-outlined text-cyan-700">call</span>
                <span>{schoolProfile.phone}</span>
              </a>
              <a href={schoolProfile.emailHref} className="flex items-center gap-3 hover:text-slate-900">
                <span className="material-symbols-outlined text-cyan-700">mail</span>
                <span>{schoolProfile.email}</span>
              </a>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined mt-0.5 text-cyan-700">schedule</span>
                <span>{schoolProfile.hours}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-start justify-between gap-2 border-t border-slate-200/80 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            (c) {year} <span className="font-semibold text-slate-800">{schoolProfile.name}</span>. All rights reserved.
          </p>
          <p>Powered by Kavion Innovation</p>
        </div>
      </div>
    </footer>
  )
}

export default WebsiteFooter
