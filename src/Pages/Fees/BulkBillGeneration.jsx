import React, { useState, useEffect } from 'react'
import { generateBulkBills, downloadBillsPDF } from '../../Api/fees'

function BulkBillGeneration() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const classes = ['Mother Care', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8']
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ]

  const [formData, setFormData] = useState({
    class: '',
    month: '',
    year: new Date().getFullYear().toString(),
    includeAnnualFee: false,
    includeExamFee: false,
    includeComputerFee: false
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
    setLoading(true)

    try {
      const monthStr = `${formData.year}-${formData.month}`
      const payload = {
        class: formData.class,
        month: monthStr,
        includeAnnualFee: formData.includeAnnualFee,
        includeExamFee: formData.includeExamFee,
        includeComputerFee: formData.includeComputerFee,
        includeTuitionFee: true  // Always include tuition fee
      }

      const response = await generateBulkBills(payload)
      if (response.success || (response.message && response.message.toLowerCase().includes('success'))) {
        setSuccess(`Bills generated successfully! ${response.message || ''}`)
        setFormData({
          class: '',
          month: '',
          year: new Date().getFullYear().toString(),
          includeAnnualFee: false,
          includeExamFee: false,
          includeComputerFee: false
        })
      } else {
        const errorMsg = response.message || 'Failed to generate bulk bills'
        setError(errorMsg)
      }
    } catch (err) {
      const errorMessage = err?.message || err?.data?.message || 'Failed to generate bulk bills'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!formData.class || !formData.month) {
      setError('Please select Class and Month to download PDF')
      return
    }

    setError('')
    setLoading(true)

    try {
      const monthStr = `${formData.year}-${formData.month}`
      const blob = await downloadBillsPDF(formData.class, monthStr)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bills-${formData.class}-${monthStr}.pdf`
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
    <div className="space-y-6" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Bulk Bill Generation</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">receipt_long</span>
          Generate and download bills for multiple students at once
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400 flex-shrink-0">error</span>
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-red-700 dark:text-red-300 flex-shrink-0">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 flex-shrink-0">check_circle</span>
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">{success}</p>
          </div>
          <button onClick={() => setSuccess('')} className="text-green-700 dark:text-green-300 flex-shrink-0">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Class Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">class</span>
              Select Class *
            </label>
            <select
              required
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
            >
              <option value="">-- Select Class --</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Month Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">calendar_month</span>
              Select Month *
            </label>
            <select
              required
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
            >
              <option value="">-- Select Month --</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">date_range</span>
              Year
            </label>
            <input
              type="number"
              min="2020"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
            />
          </div>
        </div>

        {/* Fee Selection */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#137fec]">card_giftcard</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fee Selection</h3>
          </div>

          {/* Tuition Fee - Always Included */}
          <div className="bg-linear-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-4 mb-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">calculate</span>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Tuition Fee</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Automatically included - Always applies to all students</p>
              </div>
              <span className="ml-auto px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold">REQUIRED</span>
            </div>
          </div>

          {/* Optional Fees - Checkboxes */}
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Optional Fees (Select as needed):</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
              <input
                type="checkbox"
                checked={formData.includeAnnualFee}
                onChange={(e) => setFormData({ ...formData, includeAnnualFee: e.target.checked })}
                className="w-5 h-5 text-[#137fec] rounded accent-[#137fec]"
              />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Annual Fee</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
              <input
                type="checkbox"
                checked={formData.includeExamFee}
                onChange={(e) => setFormData({ ...formData, includeExamFee: e.target.checked })}
                className="w-5 h-5 text-[#137fec] rounded accent-[#137fec]"
              />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Exam Fee</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200">
              <input
                type="checkbox"
                checked={formData.includeComputerFee}
                onChange={(e) => setFormData({ ...formData, includeComputerFee: e.target.checked })}
                className="w-5 h-5 text-[#137fec] rounded accent-[#137fec]"
              />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Computer Fee</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-col md:flex-row">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#137fec] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">sync</span>
                Generating Bills...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">receipt_long</span>
                Generate Bills
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={loading || !formData.class || !formData.month}
            className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2 transition-colors duration-300"
          >
            <span className="material-symbols-outlined">download</span>
            Download PDF
          </button>
        </div>
      </form>
    </div>
  )
}

export default BulkBillGeneration

