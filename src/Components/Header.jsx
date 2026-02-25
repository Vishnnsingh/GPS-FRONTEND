import React from 'react'
import { getUser } from '../Api/auth'

function Header({ sidebarOpen, setSidebarOpen }) {
  const user = getUser()
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U'
  const schoolName = 'Gyanoday Public School'

  return (
    <header
      className="bg-white dark:bg-[#101922] shadow-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40"
      style={{ fontFamily: "'Lexend', sans-serif" }}
    >
      <div className="relative flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 min-h-[56px] sm:min-h-[60px]">

        {/* ================= LEFT SECTION ================= */}
        <div className="flex items-center gap-2">

          {/* Hamburger - Mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Toggle menu"
          >
            <span className="material-symbols-outlined text-[#137fec] text-lg">
              menu
            </span>
          </button>

          {/* Desktop Logo + Name */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="bg-[#137fec] p-1.5 rounded-lg">
              <span className="material-symbols-outlined text-white text-lg sm:text-xl">
                school
              </span>
            </div>

            <div>
              <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 block truncate">
                {schoolName}
              </span>
              <span className="text-sm sm:text-base font-bold text-[#0d141b] dark:text-white block truncate">
                EduPortal
              </span>
            </div>
          </div>
        </div>

        {/* ================= MOBILE CENTER SCHOOL NAME ================= */}
        <div className="sm:hidden absolute left-12 right-12 text-center">
          <span className="text-sm font-semibold text-[#0d141b] dark:text-white truncate block">
            {schoolName}
          </span>
        </div>

        {/* ================= RIGHT PROFILE ================= */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#137fec] flex items-center justify-center text-white font-bold text-xs sm:text-sm">
            {userInitial}
          </div>

          <span className="material-symbols-outlined text-base text-slate-600 dark:text-slate-400 hidden sm:inline">
            arrow_drop_down
          </span>
        </div>

      </div>
    </header>
  )
}

export default Header