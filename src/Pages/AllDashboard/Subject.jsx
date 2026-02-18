import React from 'react'
import AllSubjectDetails from '../../Components/Subject/AllSubjectDetails'

function Subject() {
  return (
    <div className="space-y-6" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Subjects Management</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">library_books</span>
            Manage and organize all subjects in your curriculum
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="material-symbols-outlined">info</span>
          <span>Complete subject directory</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <AllSubjectDetails />
      </div>
    </div>
  )
}

export default Subject
