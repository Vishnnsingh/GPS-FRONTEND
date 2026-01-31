import React from 'react'
import { getUser } from '../Api/auth'

function Header() {
  const user = getUser()
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U'
  const userRole = user?.role || 'user'

  return (
    <header className="bg-white dark:bg-[#101922] shadow-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div className="relative flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 flex-1">
          <div className="bg-[#137fec] p-1.5 rounded-lg">
            <span className="material-symbols-outlined text-white text-xl">school</span>
          </div>
          <span className="text-base font-bold text-[#0d141b] dark:text-white">EduPortal</span>
        </div>
        
        {/* Center: Dashboard Title */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg lg:text-xl font-black text-[#0d141b] dark:text-white">
          Dashboard
        </h1>
        
        {/* Right: Profile */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#137fec] flex items-center justify-center text-white font-bold text-sm">
              {userInitial}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {user?.email || 'User'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {userRole}
              </span>
            </div>
            <span className="material-symbols-outlined text-base text-slate-600 dark:text-slate-400">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

