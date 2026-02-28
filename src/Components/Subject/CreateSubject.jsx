import React, { useState } from 'react'
import { createSubject } from '../../Api/subjects'

function CreateSubject({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    code: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.name || !formData.code) {
        setError('Please fill all required fields')
        setLoading(false)
        return
      }

      const submitData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase()
      }

      const response = await createSubject(submitData)

      if (response.success) {
        setSuccess(true)
        setError('')
        
        // Reset form
        setFormData({
          name: '',
          code: ''
        })
        
        // Show success message for 2 seconds then close
        setTimeout(() => {
          setSuccess(false)
          onSuccess?.()
          onClose()
        }, 2000)
      }
    } catch (err) {
      setError(err?.message || 'Failed to create subject')
    } finally {
      setLoading(false)
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
      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto table-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(99, 126, 153) rgb(224, 242, 254)' }}>
        {/* Header */}
        <div className="sticky top-0 bg-cyan-500 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-black">Create New Subject</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Subject created successfully!</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Subject Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Subject Name <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
              <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">book</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="Enter subject name (e.g., Hindi, English)"
                required
              />
            </div>
          </div>

          {/* Subject Code */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Subject Code <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
              <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">code</span>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 uppercase"
                placeholder="Enter subject code (e.g., HND, ENG)"
                required
                maxLength={10}
                style={{ textTransform: 'uppercase' }}
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Code will be automatically converted to uppercase
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-bold text-white bg-cyan-500 hover:bg-cyan-500/90 rounded-lg shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">check</span>
                  <span>Create Subject</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateSubject

