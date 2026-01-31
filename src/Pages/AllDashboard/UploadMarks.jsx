import React, { useState } from 'react'
import SubmitMarks from '../../Components/MarksUpload/SubmitMarks'
import ViewMarks from '../../Components/MarksUpload/ViewMarks'

function UploadMarks() {
  const [activeTab, setActiveTab] = useState('submit')

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700 inline-flex">
        <button
          onClick={() => setActiveTab('submit')}
          className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'submit'
              ? 'bg-[#137fec] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">upload</span>
            Submit Marks
          </span>
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'view'
              ? 'bg-[#137fec] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">visibility</span>
            View Marks
          </span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'submit' && <SubmitMarks />}
      {activeTab === 'view' && <ViewMarks />}
    </div>
  )
}

export default UploadMarks