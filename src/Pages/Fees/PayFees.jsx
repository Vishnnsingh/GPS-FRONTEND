import React, { useEffect, useState } from 'react'
import { getFeesForStudent, payFees } from '../../Api/fees'

function PayFees() {
  const [studentId, setStudentId] = useState('')
  const [month, setMonth] = useState('January')
  const [amountPaid, setAmountPaid] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [feeData, setFeeData] = useState(null)

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

  useEffect(() => {
    if (studentId && month) {
      fetchFee()
    } else {
      setFeeData(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, month])

  const fetchFee = async () => {
    setError('')
    try {
      setLoading(true)
      const res = await getFeesForStudent(String(studentId).trim(), month)
      setFeeData(res?.fees?.[0] || null)
    } catch (err) {
      setError(err?.message || 'Failed to fetch fee')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!studentId || !amountPaid) {
      setError('Please provide student ID and amount')
      return
    }

    try {
      setLoading(true)
      const payload = {
        student_id: String(studentId).trim(),
        month,
        amount_paid: Number(amountPaid),
        payment_method: paymentMethod,
        notes
      }
      const res = await payFees(payload)
      setSuccess(res?.message || 'Payment processed')
      setAmountPaid('')
      setNotes('')
      fetchFee()
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Process Payment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Student ID / Roll</label>
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" placeholder="Enter student ID or roll" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Month</label>
              <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {months.map(m => (<option key={m} value={m}>{m}</option>))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Amount to Pay</label>
              <input type="number" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" placeholder="Enter amount" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
              <option>Cash</option>
              <option>Check</option>
              <option>Bank Transfer</option>
              <option>Card</option>
              <option>UPI</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" rows={3} />
          </div>

          {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700">{error}</div>}
          {success && <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-700">{success}</div>}

          <div className="flex items-center gap-3">
            <button disabled={loading} className="bg-[#137fec] text-white px-4 py-2 rounded-lg font-bold">{loading ? 'Processing...' : 'Process Payment'}</button>
            <button type="button" onClick={fetchFee} className="px-4 py-2 rounded-lg border border-slate-200">Refresh</button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h4 className="text-md font-bold text-slate-900 dark:text-white">Fee Snapshot</h4>
        {loading ? (
          <p className="text-sm mt-2">Loading...</p>
        ) : feeData ? (
          <div className="mt-3 text-sm text-slate-700 dark:text-slate-300 space-y-2">
            <div className="flex justify-between"><span>Total Fee</span><strong>₹{feeData.total_fee}</strong></div>
            <div className="flex justify-between"><span>Paid</span><strong className="text-green-600">₹{feeData.paid_amount}</strong></div>
            <div className="flex justify-between"><span>Balance</span><strong className="text-red-600">₹{feeData.balance}</strong></div>
            <div className="flex justify-between"><span>Advance</span><strong className="text-blue-600">₹{feeData.advance || 0}</strong></div>
            <div className="mt-2 text-xs text-slate-500">Invoice date: {feeData.created_at ? new Date(feeData.created_at).toLocaleDateString('en-IN') : '--'}</div>
          </div>
        ) : (
          <p className="text-sm mt-2 text-slate-500">Enter student id and month to see fee snapshot.</p>
        )}
      </div>
    </div>
  )
}

export default PayFees
