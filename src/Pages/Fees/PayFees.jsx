import React, { useState } from 'react'
import { recordFeePayment } from '../../Api/fees'

function PayFees() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [formData, setFormData] = useState({
    class: '',
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
    setPaymentDetails(null)
    setLoading(true)

    try {
      const payload = {
        class: formData.class,
        roll_number: parseInt(formData.roll_number),
        amount_paid: parseFloat(formData.amount_paid),
        payment_mode: formData.payment_mode,
        payment_date: formData.payment_date,
        month: formData.month
      }

      const response = await recordFeePayment(payload)
      // Handle different response structures
      if (response.message || response.bill_id) {
        setSuccess(response.message || 'Payment recorded successfully!')
        setPaymentDetails(response)
        // Reset form
        setFormData({
          class: '',
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
      setError(err?.message || err?.data?.message || 'Failed to record payment')
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

      {/* Payment Details */}
      {paymentDetails && (
        <div className="mt-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-4">
          <h4 className="text-md font-bold text-slate-900 dark:text-white">Payment Details</h4>
          
          {/* Student Info */}
          {paymentDetails.student && (
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Student Information</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Name:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white">{paymentDetails.student.name}</span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Father Name:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white">{paymentDetails.student.father_name || '--'}</span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Class:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white">{paymentDetails.student.class}</span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Section:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white">{paymentDetails.student.section || '--'}</span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Roll No:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white">{paymentDetails.student.roll_no}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bill Info */}
          {paymentDetails.bill && (
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bill Information</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Bill ID:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white text-xs">{paymentDetails.bill_id || paymentDetails.bill.id}</span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Month:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white">{paymentDetails.bill.month}</span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Total Amount:</span>
                  <span className="ml-2 font-medium text-slate-900 dark:text-white">₹{paymentDetails.bill.total_amount || 0}</span>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400">Status:</span>
                  <span className={`ml-2 font-medium px-2 py-1 rounded-full text-xs ${
                    paymentDetails.bill.bill_status === 'paid' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : paymentDetails.bill.bill_status === 'partial'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  }`}>
                    {paymentDetails.bill.bill_status || 'pending'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          {paymentDetails.payment_summary && (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Summary</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Amount Paid:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">₹{paymentDetails.payment_summary.amount_paid || paymentDetails.amount_paid || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Total Paid:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">₹{paymentDetails.payment_summary.total_paid || 0}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                  <span className="text-slate-600 dark:text-slate-400">Remaining Balance:</span>
                  <span className="font-bold text-red-600 dark:text-red-400">₹{paymentDetails.payment_summary.balance || paymentDetails.payment_summary.remaining || 0}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PayFees

