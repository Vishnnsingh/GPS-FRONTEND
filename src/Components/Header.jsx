import React from 'react'
import { getUser } from '../Api/auth'

function Header({ sidebarOpen, setSidebarOpen }) {
  const user = getUser()
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U'
  const roleLabel = user?.role ? String(user.role).toUpperCase() : 'USER'
  const schoolName = import.meta.env.VITE_SCHOOL_NAME || 'Gyanoday Public School'

  return (
    <header className="relative z-40 px-3 pt-3 sm:px-4 sm:pt-4 lg:px-6">
      <div className="ryme-glass rounded-2xl px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-200/30 text-cyan-100 hover:bg-cyan-300/10 lg:hidden"
              title="Toggle menu"
            >
              <span className="material-symbols-outlined text-lg">menu</span>
            </button>

            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/15 text-cyan-200">
              <span className="material-symbols-outlined">school</span>
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100/75 sm:text-xs">
                Admin Workspace
              </p>
              <p className="truncate text-sm font-bold text-white sm:text-base">{schoolName}</p>
            </div>
          </div>

          <div className="hidden rounded-xl border border-cyan-200/25 bg-cyan-300/8 px-3 py-2 text-xs text-slate-200 md:block">
            Unified dashboard for students, marks, fees and promotions
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/25 bg-cyan-300/10 px-2.5 py-1.5">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300 text-xs font-extrabold text-[#05233d]">
              {userInitial}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-xs font-semibold text-white">{user?.email || 'user@school.com'}</p>
              <p className="text-[10px] tracking-[0.14em] text-cyan-100/80">{roleLabel}</p>
            </div>
            <span className="material-symbols-outlined hidden text-slate-300 sm:inline">expand_more</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
