import React, { useState, useEffect } from 'react'
import { getAllSubjects, deleteSubjectById } from '../../Api/subjects'

function DeleteSubject({ isOpen, onClose, onSuccess }) {
  const [allSubjects, setAllSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (isOpen) {
      fetchAllSubjects()
    }
  }, [isOpen])

  const fetchAllSubjects = async () => {
    setLoadingSubjects(true)
    setError('')
    try {
      const response = await getAllSubjects()
      if (response.success && response.all_subjects) {
        setAllSubjects(response.all_subjects || [])
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch subjects')
    } finally {
      setLoadingSubjects(false)
    }
  }

  const handleDelete = async (subjectId, subjectName) => {
    if (!window.confirm(`Are you sure you want to delete "${subjectName}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(subjectId)
    setError('')
    setSuccess('')

    try {
      const response = await deleteSubjectById(subjectId)
      if (response.success) {
        setSuccess(`Subject "${subjectName}" deleted successfully!`)
        // Refresh the list
        fetchAllSubjects()
        // Call onSuccess callback after a delay
        setTimeout(() => {
          onSuccess?.()
        }, 1000)
      }
    } catch (err) {
      // Handle duplicate key error
      if (err?.error?.includes('duplicate key') || err?.error?.includes('unique constraint')) {
        setError('Cannot delete subject. It is currently assigned to one or more classes.')
      } else if (err?.message) {
        setError(err.message)
      } else if (err?.error) {
        setError(err.error)
      } else {
        setError('Failed to delete subject. Please try again.')
      }
    } finally {
      setDeletingId(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#137fec] to-[#0d5bb8] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <span className="material-symbols-outlined text-xl">delete</span>
            </div>
            <div>
              <h2 className="text-xl font-black">Delete Subject</h2>
              <p className="text-xs text-white/80 mt-0.5">Select a subject to delete</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">{success}</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loadingSubjects && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <span className="material-symbols-outlined animate-spin text-4xl text-[#137fec] mb-2">sync</span>
                <p className="text-sm text-slate-500 dark:text-slate-400">Loading subjects...</p>
              </div>
            </div>
          )}

          {/* Subjects List - Card Style */}
          {!loadingSubjects && allSubjects.length > 0 && (
            <div className="space-y-2">
              {allSubjects.map((subject, index) => (
                <div
                  key={subject.id}
                  className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600 hover:border-[#137fec] hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Serial Number Badge */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#137fec] text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      
                      {/* Subject Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                            {subject.name || '-'}
                          </h3>
                          <span className="px-2 py-0.5 bg-[#137fec]/10 text-[#137fec] dark:bg-[#137fec]/20 dark:text-[#137fec] rounded text-xs font-medium">
                            {subject.code || '-'}
                          </span>
                        </div>
                        {subject.created_at && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">calendar_today</span>
                            Created: {new Date(subject.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div className="flex-shrink-0 ml-4">
                      <button
                        onClick={() => handleDelete(subject.id, subject.name)}
                        disabled={deletingId === subject.id}
                        className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Subject"
                      >
                        {deletingId === subject.id ? (
                          <span className="material-symbols-outlined animate-spin text-xl">sync</span>
                        ) : (
                          <span className="material-symbols-outlined text-xl">delete</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Subjects */}
          {!loadingSubjects && allSubjects.length === 0 && (
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-600">
              <span className="material-symbols-outlined text-5xl text-slate-400 mb-3">book</span>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No subjects found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total: <span className="font-medium text-slate-700 dark:text-slate-300">{allSubjects.length}</span> subjects
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteSubject

