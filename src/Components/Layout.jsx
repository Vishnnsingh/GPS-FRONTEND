import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell h-screen flex flex-col overflow-hidden">
      <div className="pointer-events-none fixed -left-14 top-10 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl"></div>
      <div className="pointer-events-none fixed right-[-80px] top-40 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl"></div>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex overflow-hidden min-h-0">
        <Outlet context={{ sidebarOpen, setSidebarOpen }} />
      </div>
    </div>
  )
}

export default Layout

