import React from 'react'
import WebsiteHeader from '../WebsiteHeader'
import WebsiteFooter from '../WebsiteFooter'

function WebsiteLayout({ children }) {
  return (
    <div className="gps-site min-h-screen text-slate-900">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,rgba(14,116,144,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.34),transparent)]"></div>
      <div className="pointer-events-none fixed -left-16 top-24 h-60 w-60 rounded-full bg-[#0f766e]/10 blur-3xl"></div>
      <div className="pointer-events-none fixed bottom-20 right-[-60px] h-72 w-72 rounded-full bg-[#0f172a]/8 blur-3xl"></div>
      <WebsiteHeader />
      <main className="relative z-10 pb-16 pt-[106px] sm:pt-[116px]">{children}</main>
      <WebsiteFooter />
    </div>
  )
}

export default WebsiteLayout


