import React, { useState } from 'react'
import SubmitMarks from '../../Components/MarksUpload/SubmitMarks'
import ViewMarks from '../../Components/MarksUpload/ViewMarks'

function UploadMarks() {
  const [activeTab, setActiveTab] = useState('submit')

  return (
    <div className="space-y-6" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Marks Management</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">assessment</span>
            Upload, view and manage student marks
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="material-symbols-outlined">info</span>
          <span>Efficient marks tracking system</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm border border-slate-200 dark:border-slate-700 inline-flex gap-2">
        <button
          onClick={() => setActiveTab('submit')}
          className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'submit'
              ? 'bg-gradient-to-r from-[#137fec] to-blue-600 text-white shadow-lg scale-105'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-lg">upload_file</span>
          <span>Submit Marks</span>
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            activeTab === 'view'
              ? 'bg-gradient-to-r from-[#137fec] to-blue-600 text-white shadow-lg scale-105'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-lg">visibility</span>
          <span>View Marks</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="transition-all duration-300 ease-in-out">
          {activeTab === 'submit' && <SubmitMarks />}
          {activeTab === 'view' && <ViewMarks />}
        </div>
      </div>
    </div>
  )
}

export default UploadMarks
