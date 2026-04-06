import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell h-screen flex flex-col overflow-hidden">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex overflow-hidden min-h-0">
        <Outlet context={{ sidebarOpen, setSidebarOpen }} />
      </div>
    </div>
  )
}

export default Layout

