import React, { useState } from 'react'
import { getFeeList, recordFeePayment } from '../../Api/fees'
import { getAllStudents } from '../../Api/students'
import { emitToast } from '../../Api/auth'
import { CLASS_OPTIONS } from '../../constants/classOptions'

const toNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const parseFeeListResponse = (response) => {
  if (response?.success) {
    return response.fees || response.data || []
  }
  if (Array.isArray(response?.data)) {
    return response.data
  }
  if (Array.isArray(response?.fees)) {
    return response.fees
  }
  if (Array.isArray(response)) {
    return response
  }
  return []
}

function PayFees() {
  const [loading, setLoading] = useState(false)
  const [fetchingDetails, setFetchingDetails] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentResponse, setPaymentResponse] = useState(null)
  const [studentDetails, setStudentDetails] = useState(null)
  const [feeDetails, setFeeDetails] = useState(null)
  const [formData, setFormData] = useState({
    class: '',
    section: '',
    roll_number: '',
    amount_paid: '',
    payment_mode: 'cash',
    payment_date: new Date().toISOString().split('T')[0],
    month: '',
  })

  const paymentModes = [
    { value: 'cash', label: 'Cash' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
  ]

  const handleIdentityFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setStudentDetails(null)
    setFeeDetails(null)
    setError('')
  }

  const handleFetchDetails = async () => {
    const normalizedClass = String(formData.class || '').trim()
    const normalizedSection = String(formData.section || '').trim().toUpperCase()
    const parsedRoll = parseInt(formData.roll_number, 10)

    if (!normalizedClass || !normalizedSection || !parsedRoll) {
      setError('Please select Class, enter Section and Roll Number first')
      return
    }

    setError('')
    setSuccess('')
    setFetchingDetails(true)
    setStudentDetails(null)
    setFeeDetails(null)

    try {
      const [studentsResponse, feeResponse] = await Promise.all([
        getAllStudents({
          class: normalizedClass,
          section: normalizedSection,
          roll_no: parsedRoll,
          status: 'active',
        }),
        getFeeList({
          class: normalizedClass,
          section: normalizedSection,
          month: formData.month || '',
        }),
      ])

      const students = studentsResponse?.students || studentsResponse?.data || []
      const matchedStudent = (Array.isArray(students) ? students : []).find((student) => {
        const studentRoll = parseInt(student?.Roll || student?.roll_no, 10)
        const studentSection = String(student?.Section || student?.section || '').trim().toUpperCase()
        return studentRoll === parsedRoll && studentSection === normalizedSection
      })

      if (!matchedStudent) {
        setError('No active student found for selected Class, Section and Roll Number')
        return
      }

      const fees = parseFeeListResponse(feeResponse)
      const matchedFees = (Array.isArray(fees) ? fees : []).filter((fee) => {
        const feeRoll = parseInt(fee?.roll_no || fee?.Roll, 10)
        const feeSection = String(fee?.section || fee?.Section || '').trim().toUpperCase()
        return feeRoll === parsedRoll && feeSection === normalizedSection
      })

      const monthMatchedFees = formData.month
        ? matchedFees.filter((fee) => String(fee?.month || '') === formData.month)
        : matchedFees
      const selectedFee = monthMatchedFees[0] || matchedFees[0] || null

      setStudentDetails({
        student_id:
          matchedStudent?.ID ||
          matchedStudent?._id ||
          matchedStudent?.id ||
          matchedStudent?.student_id ||
          '--',
        name: matchedStudent?.Name || matchedStudent?.name || '--',
        father_name: matchedStudent?.Father || matchedStudent?.father_name || '--',
        mobile: matchedStudent?.Mobile || matchedStudent?.mobile || '--',
        address: matchedStudent?.Address || matchedStudent?.address || '--',
        class: matchedStudent?.Class || matchedStudent?.class || normalizedClass,
        section: matchedStudent?.Section || matchedStudent?.section || normalizedSection,
        roll_no: matchedStudent?.Roll || matchedStudent?.roll_no || parsedRoll,
      })

      if (selectedFee) {
        const totalFee = toNumber(selectedFee?.total_fee)
        const totalPaid = toNumber(selectedFee?.total_paid ?? selectedFee?.paid_amount)
        const netPayable = toNumber(selectedFee?.net_payable ?? selectedFee?.balance ?? totalFee - totalPaid)

        setFeeDetails({
          bill_id: selectedFee?.bill_id || '--',
          month: selectedFee?.month || formData.month || '--',
          status: selectedFee?.bill_status || (netPayable <= 0 ? 'paid' : 'unpaid'),
          total_fee: totalFee,
          total_paid: totalPaid,
          net_payable: netPayable,
        })

        setFormData((prev) => ({
          ...prev,
          amount_paid: prev.amount_paid || (netPayable > 0 ? String(netPayable) : ''),
        }))
      }

      setSuccess('Student details fetched successfully')
      emitToast('success', 'Student details loaded', 'Pay Fees')
    } catch (err) {
      setError(err?.message || 'Failed to fetch student details')
    } finally {
      setFetchingDetails(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setPaymentResponse(null)
    setShowPaymentModal(false)

    if (!studentDetails) {
      setError('Please click "Fetch Details" first')
      return
    }

    setLoading(true)

    try {
      const payload = {
        class: formData.class,
        section: String(formData.section || '').trim().toUpperCase(),
        roll_number: parseInt(formData.roll_number, 10),
        amount_paid: parseFloat(formData.amount_paid),
        payment_mode: formData.payment_mode,
        payment_date: formData.payment_date,
        month: formData.month,
      }

      const response = await recordFeePayment(payload)

      if (response.message || response.payment || response.bill_id) {
        setSuccess(response.message || 'Payment processed successfully!')
        emitToast('success', response.message || 'Payment processed successfully!', 'Fee Payment')
        setPaymentResponse(response)
        setShowPaymentModal(true)

        setFormData({
          class: '',
          section: '',
          roll_number: '',
          amount_paid: '',
          payment_mode: 'cash',
          payment_date: new Date().toISOString().split('T')[0],
          month: '',
        })
        setStudentDetails(null)
        setFeeDetails(null)
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

      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class *</label>
            <select
              required
              value={formData.class}
              onChange={(e) => handleIdentityFieldChange('class', e.target.value)}
              className="w-full px-3 py-2 border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
            >
              <option value="">Select Class</option>
              {CLASS_OPTIONS.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section *</label>
            <input
              type="text"
              required
              value={formData.section}
              onChange={(e) => handleIdentityFieldChange('section', e.target.value.toUpperCase())}
              placeholder="e.g., A, B, C"
              className="w-full px-3 py-2 border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Roll Number *</label>
            <input
              type="number"
              required
              min="1"
              value={formData.roll_number}
              onChange={(e) => handleIdentityFieldChange('roll_number', e.target.value)}
              placeholder="Enter roll number"
              className="w-full px-3 py-2 border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleFetchDetails}
            disabled={fetchingDetails}
            className="px-5 py-2 bg-[#137fec] text-white rounded-lg hover:bg-[#137fec]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            {fetchingDetails ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                Fetching...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">person_search</span>
                Fetch Details
              </>
            )}
          </button>
          {studentDetails && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
              Details loaded
            </span>
          )}
        </div>

        {studentDetails && (
          <div className="rounded-xl border border-cyan-200/30 dark:border-cyan-700/50 bg-cyan-50/30 dark:bg-cyan-900/10 p-4 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Student Details</h4>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold">Name:</span> {studentDetails.name}</p>
                <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold">Father:</span> {studentDetails.father_name}</p>
                <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold">Mobile:</span> {studentDetails.mobile}</p>
                <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold">Class:</span> {studentDetails.class}</p>
                <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold">Section:</span> {studentDetails.section}</p>
                <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold">Roll:</span> {studentDetails.roll_no}</p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200/70 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 p-3">
              <h5 className="text-sm font-bold text-slate-900 dark:text-white">Fee Details</h5>
              {feeDetails ? (
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold">Month:</span> {feeDetails.month}</p>
                  <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold">Status:</span> {feeDetails.status}</p>
                  <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold">Bill ID:</span> {feeDetails.bill_id}</p>
                  <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold">Total Fee:</span> Rs. {feeDetails.total_fee.toLocaleString('en-IN')}</p>
                  <p className="text-slate-700 dark:text-slate-300"><span className="font-semibold">Paid:</span> Rs. {feeDetails.total_paid.toLocaleString('en-IN')}</p>
                  <p className="font-bold text-red-600 dark:text-red-300"><span className="font-semibold">Due:</span> Rs. {feeDetails.net_payable.toLocaleString('en-IN')}</p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Fee record not found for selected filters. You can still continue payment if applicable.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Month *</label>
            <input
              type="month"
              required
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              className="w-full px-3 py-2 border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
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
              className="w-full px-3 py-2 border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Mode *</label>
            <select
              required
              value={formData.payment_mode}
              onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
              className="w-full px-3 py-2 border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 dropdown-cyan"
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
              className="w-full px-3 py-2 border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !studentDetails}
            className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-500/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-cyan-500/20"
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
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto table-scrollbar"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(99, 126, 153) rgb(224, 242, 254)' }}
            onClick={(e) => e.stopPropagation()}
          >
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

            <div className="space-y-4">
              {paymentResponse.payment?.receipt_no && (
                <div className="bg-gradient-to-r from-cyan-50/30 to-cyan-500/10 dark:from-cyan-900/30 dark:to-cyan-800/20 rounded-xl p-5 border border-cyan-200/30 dark:border-cyan-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-1">Receipt Number</p>
                      <p className="text-2xl font-bold text-cyan-200 dark:text-cyan-200">{paymentResponse.payment.receipt_no}</p>
                    </div>
                    <span className="material-symbols-outlined text-4xl text-cyan-200 dark:text-cyan-200">receipt</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-1">Amount Paid</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    Rs. {paymentResponse.payment?.amount_paid?.toLocaleString('en-IN') || paymentResponse.amount_paid?.toLocaleString('en-IN') || '0'}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-1">Advance Created</p>
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    Rs. {paymentResponse.payment?.advance_created?.toLocaleString('en-IN') || '0'}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-1">Remaining</p>
                  <p className={`text-xl font-bold ${(paymentResponse.payment?.remaining || 0) > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    Rs. {paymentResponse.payment?.remaining?.toLocaleString('en-IN') || '0'}
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold mb-1">Bill ID</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white break-all">
                    {paymentResponse.payment?.bill_id || paymentResponse.bill_id || '--'}
                  </p>
                </div>
              </div>

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
