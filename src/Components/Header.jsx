import React from 'react'
import { getUser } from '../Api/auth'

function Header({ sidebarOpen, setSidebarOpen }) {
  const user = getUser()
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U'
  const roleLabel = user?.role ? String(user.role).toUpperCase() : 'USER'
  const schoolName = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'

  return (
    <header className="relative z-40 px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6">
      <div className="rounded-2xl border border-[#d8c8a7]/70 bg-white/92 px-3 py-2 shadow-[0_12px_28px_rgba(117,94,56,0.14)] sm:px-4 sm:py-3 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#d2bf98]/75 bg-[#fffaf0] text-[#8c6a33] hover:bg-[#f3e8d0] lg:hidden"
              title="Toggle menu"
            >
              <span className="material-symbols-outlined text-lg">menu</span>
            </button>

            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#78d6f3]/25 text-[#0f4c68]">
              <span className="material-symbols-outlined">school</span>
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-[#9b7a45] sm:text-xs">
                Admin Workspace
              </p>
              <p className="truncate text-sm font-bold text-[#1f2d45] sm:text-base">{schoolName}</p>
            </div>
          </div>

          <div className="hidden rounded-xl border border-[#d8e7f2] bg-[#f2f9fe] px-3 py-2 text-xs text-[#546b8a] md:block">
            Unified dashboard for students, marks, fees and promotions
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-[#d8e7f2] bg-[#f4f9ff] px-2.5 py-1.5">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7ad7f2] to-[#55c7e8] text-xs font-extrabold text-[#0f3d56]">
              {userInitial}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-xs font-semibold text-[#1f2d45]">{user?.email || 'user@school.com'}</p>
              <p className="text-[10px] tracking-[0.14em] text-[#8f7140]">{roleLabel}</p>
            </div>
            <span className="material-symbols-outlined hidden text-[#7d90ad] sm:inline">expand_more</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
