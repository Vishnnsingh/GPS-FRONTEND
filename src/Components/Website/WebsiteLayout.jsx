import React from 'react'
import WebsiteHeader from '../WebsiteHeader'
import WebsiteFooter from '../WebsiteFooter'

function WebsiteLayout({ children }) {
  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-[#101922] text-slate-900 dark:text-slate-100"
      style={{ fontFamily: "'Lexend', sans-serif" }}
    >
      <WebsiteHeader />
      <main>{children}</main>
      <WebsiteFooter />
    </div>
  )
}

export default WebsiteLayout


