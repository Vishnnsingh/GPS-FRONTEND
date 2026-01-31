import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

function Layout() {
  return (
    <div className="h-screen bg-slate-50 dark:bg-[#101922] flex flex-col overflow-hidden" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout

