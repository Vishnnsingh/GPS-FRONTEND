import React from 'react'
import WebsiteHeader from '../WebsiteHeader'
import WebsiteFooter from '../WebsiteFooter'

function WebsiteLayout({ children }) {
  return (
    <div className="min-h-screen gps-page text-slate-100">
      <div className="pointer-events-none fixed -top-28 -left-20 h-72 w-72 rounded-full bg-[#d2a75b]/22 blur-3xl"></div>
      <div className="pointer-events-none fixed top-12 right-[-70px] h-80 w-80 rounded-full bg-[#355fa8]/18 blur-3xl"></div>
      <WebsiteHeader />
      <div className="h-[100px] sm:h-[108px]" aria-hidden="true"></div>
      <main className="relative z-10">{children}</main>
      <WebsiteFooter />
    </div>
  )
}

export default WebsiteLayout


