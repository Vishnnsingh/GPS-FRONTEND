import React, { useState } from 'react'
import { generateBillsPDF, generateBillsForClass, generateBillsForAllClasses } from '../../Api/fees'

function Bills() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    class: '',
    month: ''
  })
  const [actionType, setActionType] = useState('generate') // generate, generateClass, generateAll, download

  const handleGeneratePDF = async () => {
    if (!formData.month) {
      setError('Please enter month')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const blob = await generateBillsPDF(formData.month)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bills-${formData.month}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setSuccess('PDF downloaded successfully')
    } catch (err) {
      setError(err?.message || 'Failed to generate PDF')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateForClass = async () => {
    if (!formData.class || !formData.month) {
      setError('Please enter class and month')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await generateBillsForClass(formData.class, formData.month)
      if (response.success) {
        setSuccess(`Bills generated successfully for Class ${formData.class}!`)
        setFormData({ class: '', month: '' })
      }
    } catch (err) {
      setError(err?.message || 'Failed to generate bills')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateForAll = async () => {
    if (!formData.month) {
      setError('Please enter month')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await generateBillsForAllClasses(formData.month)
      if (response.success) {
        setSuccess(`Bills generated successfully for all classes!`)
        setFormData({ class: '', month: '' })
      }
    } catch (err) {
      setError(err?.message || 'Failed to generate bills')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (actionType === 'generate') {
      await handleGeneratePDF()
    } else if (actionType === 'generateClass') {
      await handleGenerateForClass()
    } else if (actionType === 'generateAll') {
      await handleGenerateForAll()
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bills Management</h3>

      {/* Action Type Selection */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Select Action:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActionType('generate')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              actionType === 'generate'
                ? 'bg-[#137fec] text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Download PDF
          </button>
          <button
            onClick={() => setActionType('generateClass')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              actionType === 'generateClass'
                ? 'bg-[#137fec] text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Generate for Class
          </button>
          <button
            onClick={() => setActionType('generateAll')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              actionType === 'generateAll'
                ? 'bg-[#137fec] text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Generate for All Classes
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {actionType === 'generateClass' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class *</label>
            <input
              type="text"
              required={actionType === 'generateClass'}
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              placeholder="e.g., 1, 2, 3"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Month *</label>
          <input
            type="month"
            required
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Format: YYYY-MM (e.g., 2024-01)</p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#137fec] text-white rounded-lg hover:bg-[#137fec]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                Processing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">
                  {actionType === 'generate' ? 'download' : 'receipt_long'}
                </span>
                {actionType === 'generate' && 'Download PDF'}
                {actionType === 'generateClass' && 'Generate for Class'}
                {actionType === 'generateAll' && 'Generate for All Classes'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Bills

