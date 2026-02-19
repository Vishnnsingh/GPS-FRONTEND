import React from 'react'
import { getUser } from '../Api/auth'

function Header({ sidebarOpen, setSidebarOpen }) {
  const user = getUser()
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U'
  const schoolName = 'Gyanoday Public School' // School name can be fetched from API if available

  return (
    <header className="bg-white dark:bg-[#101922] shadow-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 lg:py-4 min-h-[60px] gap-2">
        {/* Left: Hamburger Menu (Mobile) + Logo and School Name */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
            title="Toggle menu"
          >
            <span className="material-symbols-outlined text-[#137fec] text-xl">menu</span>
          </button>

          {/* Logo and School Name - Hidden on Mobile */}
          <div className="hidden sm:flex items-center gap-2 flex-1 min-w-0">
            <div className="bg-[#137fec] p-1.5 rounded-lg flex-shrink-0">
              <span className="material-symbols-outlined text-white text-lg sm:text-xl">school</span>
            </div>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 block truncate">
                {schoolName}
              </span>
              <span className="text-sm sm:text-base font-bold text-[#0d141b] dark:text-white block truncate">
                EduPortal
              </span>
            </div>
          </div>

          {/* School Name Only - Mobile */}
          <div className="sm:hidden flex-1 min-w-0">
            <span className="text-sm font-bold text-[#0d141b] dark:text-white block truncate">
              {schoolName}
            </span>
          </div>
        </div>
        
        {/* Right: Profile Initial Avatar Only */}
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#137fec] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {userInitial}
            </div>
            <span className="material-symbols-outlined text-base text-slate-600 dark:text-slate-400 flex-shrink-0">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

