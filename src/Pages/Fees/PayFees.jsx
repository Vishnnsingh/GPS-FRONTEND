import React, { useState } from 'react'
import { recordFeePayment } from '../../Api/fees'
import { emitToast } from '../../Api/auth'

function PayFees() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentResponse, setPaymentResponse] = useState(null)
  const [formData, setFormData] = useState({
    class: '',
    section: '',
    roll_number: '',
    amount_paid: '',
    payment_mode: 'cash',
    payment_date: new Date().toISOString().split('T')[0],
    month: ''
  })

  const paymentModes = [
    { value: 'cash', label: 'Cash' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online' },
    { value: 'bank_transfer', label: 'Bank Transfer' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setPaymentResponse(null)
    setShowPaymentModal(false)
    setLoading(true)

    try {
      const payload = {
        class: formData.class,
        section: formData.section,
        roll_number: parseInt(formData.roll_number),
        amount_paid: parseFloat(formData.amount_paid),
        payment_mode: formData.payment_mode,
        payment_date: formData.payment_date,
        month: formData.month
      }

      const response = await recordFeePayment(payload)
      
      // Handle successful response
      if (response.message || response.payment || response.bill_id) {
        setSuccess(response.message || 'Payment processed successfully!')
        emitToast('success', response.message || 'Payment processed successfully!', 'Fee Payment')
        setPaymentResponse(response)
        setShowPaymentModal(true)
        
        // Reset form
        setFormData({
          class: '',
          section: '',
          roll_number: '',
          amount_paid: '',
          payment_mode: 'cash',
          payment_date: new Date().toISOString().split('T')[0],
          month: ''
        })
      } else {
        setError(response.message || 'Failed to record payment')
      }
    } catch (err) {
      setError(err?.message || err?.data?.message || err?.response?.data?.message || 'Failed to record payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Record Fee Payment</h3>

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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Roll Number *</label>
            <input
              type="number"
              required
              min="1"
              value={formData.roll_number}
              onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
              placeholder="Enter roll number"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section *</label>
            <input
              type="text"
              required
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value.toUpperCase() })}
              placeholder="e.g., A, B, C"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount Paid *</label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={formData.amount_paid}
              onChange={(e) => setFormData({ ...formData, amount_paid: e.target.value })}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Mode *</label>
            <select
              required
              value={formData.payment_mode}
              onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              {paymentModes.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Date *</label>
            <input
              type="date"
              required
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
          </div>
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
                <span className="material-symbols-outlined text-sm">payments</span>
                Record Payment
              </>
            )}
          </button>
        </div>
      </form>

      {/* Payment Success Modal */}
      {showPaymentModal && paymentResponse && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPaymentModal(false)
            }
          }}
        >
          <div 
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-2">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">check_circle</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Payment Successful</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{paymentResponse.message || 'Payment processed successfully'}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              {/* Receipt Number - Highlighted */}
              {paymentResponse.payment?.receipt_no && (
                <div className="bg-gradient-to-r from-blue-50 to-[#137fec]/10 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl p-5 border border-blue-200 dark:border-blue-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">Receipt Number</p>
                      <p className="text-2xl font-bold text-[#137fec] dark:text-blue-400">{paymentResponse.payment.receipt_no}</p>
                    </div>
                    <span className="material-symbols-outlined text-4xl text-blue-400 dark:text-blue-500">receipt</span>
                  </div>
                </div>
              )}

              {/* Payment Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-1">Amount Paid</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    ₹{paymentResponse.payment?.amount_paid?.toLocaleString('en-IN') || paymentResponse.amount_paid?.toLocaleString('en-IN') || '0'}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-1">Advance Created</p>
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    ₹{paymentResponse.payment?.advance_created?.toLocaleString('en-IN') || '0'}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-1">Remaining</p>
                  <p className={`text-xl font-bold ${(paymentResponse.payment?.remaining || 0) > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    ₹{paymentResponse.payment?.remaining?.toLocaleString('en-IN') || '0'}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-1">Bill ID</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white break-all">
                    {paymentResponse.payment?.bill_id || paymentResponse.bill_id || '--'}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              {(paymentResponse.payment?.payment_id || paymentResponse.student_id) && (
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-2">Transaction Details</p>
                  <div className="space-y-1 text-sm">
                    {paymentResponse.payment?.payment_id && (
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Payment ID:</span>
                        <span className="font-medium text-slate-900 dark:text-white text-xs break-all">{paymentResponse.payment.payment_id}</span>
                      </div>
                    )}
                    {paymentResponse.student_id && (
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Student ID:</span>
                        <span className="font-medium text-slate-900 dark:text-white text-xs break-all">{paymentResponse.student_id}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-6 py-2 bg-[#137fec] text-white rounded-lg hover:bg-[#137fec]/90 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">check</span>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PayFees

