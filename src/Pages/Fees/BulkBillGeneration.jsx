import React, { useState, useEffect } from 'react'
import { generateBulkBills, downloadBillsPDF } from '../../Api/fees'

function BulkBillGeneration() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    class: '',
    section: '',
    month: '',
    includeAnnualFee: false,
    includeExamFee: false,
    includeComputerFee: false,
    includeOptionalFees: false
  })

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  // Auto-hide error message after 8 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Frontend validation: Check if at least one fee is selected
    const hasAnyFeeSelected = 
      formData.includeAnnualFee || 
      formData.includeExamFee || 
      formData.includeComputerFee || 
      formData.includeOptionalFees

    if (!hasAnyFeeSelected) {
      setError('No fees selected. Please select at least one fee type.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        class: formData.class,
        section: formData.section,
        month: formData.month,
        includeAnnualFee: formData.includeAnnualFee,
        includeExamFee: formData.includeExamFee,
        includeComputerFee: formData.includeComputerFee,
        includeOptionalFees: formData.includeOptionalFees
      }

      const response = await generateBulkBills(payload)
      // Handle different response structures
      if (response.success || (response.message && response.message.toLowerCase().includes('success'))) {
        setSuccess(`Bills generated successfully! ${response.message || ''}`)
        // Reset form
        setFormData({
          class: '',
          section: '',
          month: '',
          includeAnnualFee: false,
          includeExamFee: false,
          includeComputerFee: false,
          includeOptionalFees: false
        })
      } else {
        // Check if it's an error message
        const errorMsg = response.message || 'Failed to generate bulk bills'
        // Add helpful context if it's about fees not being selected
        if (errorMsg.toLowerCase().includes('no fees') || errorMsg.toLowerCase().includes('fee')) {
          setError(`${errorMsg}. Note: Make sure the selected fee types are defined in Fee Structure for this class and section.`)
        } else {
          setError(errorMsg)
        }
      }
    } catch (err) {
      // Handle different error structures
      const errorMessage = err?.message || err?.data?.message || err?.response?.data?.message || 'Failed to generate bulk bills'
      // Add helpful context
      if (errorMessage.toLowerCase().includes('no fees') || errorMessage.toLowerCase().includes('fee')) {
        setError(`${errorMessage} Note: Make sure the selected fee types are defined in Fee Structure for this class and section.`)
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!formData.class || !formData.month) {
      setError('Please fill Class and Month to download PDF')
      return
    }

    setError('')
    setLoading(true)

    try {
      const blob = await downloadBillsPDF(formData.class, formData.month, formData.section)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bills-${formData.class}-${formData.month}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setSuccess('PDF downloaded successfully')
    } catch (err) {
      setError(err?.message || 'Failed to download PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bulk Bill Generation</h3>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
            {error.toLowerCase().includes('fee structure') && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                💡 Tip: Go to "Fee Structure" tab and create fee structures for this class and section first.
              </p>
            )}
          </div>
          <button
            onClick={() => setError('')}
            className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-start justify-between gap-3">
          <p className="text-sm text-green-700 dark:text-green-300 flex-1">{success}</p>
          <button
            onClick={() => setSuccess('')}
            className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class *</label>
            <input
              type="text"
              required
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              placeholder="e.g., 1, 2, 3"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section</label>
            <input
              type="text"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              placeholder="e.g., A, B (optional)"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="md:col-span-2">
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
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Include Fees: <span className="text-red-500">*</span></p>
            <span className="text-xs text-slate-500 dark:text-slate-400">(Must be defined in Fee Structure)</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.includeAnnualFee}
                onChange={(e) => setFormData({ ...formData, includeAnnualFee: e.target.checked })}
                className="w-4 h-4 text-[#137fec] rounded"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Annual Fee</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.includeExamFee}
                onChange={(e) => setFormData({ ...formData, includeExamFee: e.target.checked })}
                className="w-4 h-4 text-[#137fec] rounded"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Exam Fee</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.includeComputerFee}
                onChange={(e) => setFormData({ ...formData, includeComputerFee: e.target.checked })}
                className="w-4 h-4 text-[#137fec] rounded"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Computer Fee</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.includeOptionalFees}
                onChange={(e) => setFormData({ ...formData, includeOptionalFees: e.target.checked })}
                className="w-4 h-4 text-[#137fec] rounded"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Optional Fees</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-[#137fec] text-white rounded-lg hover:bg-[#137fec]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                Generating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">receipt_long</span>
                Generate Bills
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={loading || !formData.class || !formData.month}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Download PDF
          </button>
        </div>
      </form>
    </div>
  )
}

export default BulkBillGeneration

