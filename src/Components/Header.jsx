import React from 'react'
import { getUser } from '../Api/auth'

function Header({ sidebarOpen, setSidebarOpen }) {
  const user = getUser()
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U'
  const roleLabel = user?.role ? String(user.role).toUpperCase() : 'USER'
  const schoolName = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'

  return (
    <header className="relative z-40 px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6">
      <div className="rounded-2xl border border-[#d7e9f7]/90 bg-white/92 px-3 py-2 shadow-[0_12px_28px_rgba(14,116,144,0.12)] sm:px-4 sm:py-3 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#bae6fd]/80 bg-[#f0f9ff] text-[#0369a1] hover:bg-[#e0f2fe] lg:hidden"
              title="Toggle menu"
            >
              <span className="material-symbols-outlined text-lg">menu</span>
            </button>

            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e0f2fe] text-[#0f4c68]">
              <span className="material-symbols-outlined">school</span>
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-[#0284c7] sm:text-xs">
                Admin Workspace
              </p>
              <p className="truncate text-sm font-bold text-[#0f172a] sm:text-base">{schoolName}</p>
            </div>
          </div>

          <div className="hidden rounded-xl border border-[#d7e9f7] bg-[#f4faff] px-3 py-2 text-xs text-[#546b8a] md:block">
            Unified dashboard for students, marks, fees and promotions
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-[#d7e9f7] bg-[#f8fcff] px-2.5 py-1.5">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#bae6fd] to-[#7dd3fc] text-xs font-extrabold text-[#0f3d56]">
              {userInitial}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-xs font-semibold text-[#0f172a]">{user?.email || 'user@school.com'}</p>
              <p className="text-[10px] tracking-[0.14em] text-[#0284c7]">{roleLabel}</p>
            </div>
            <span className="material-symbols-outlined hidden text-[#7d90ad] sm:inline">expand_more</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
