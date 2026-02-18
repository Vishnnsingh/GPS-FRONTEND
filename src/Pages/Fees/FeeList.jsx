import React, { useState, useEffect } from 'react'
import { getFeeList } from '../../Api/fees'

function FeeList() {
  const [feeList, setFeeList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')
  const [monthFilter, setMonthFilter] = useState('')

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

  useEffect(() => {
    if (classFilter) {
      fetchFeeList()
    }
  }, [classFilter, sectionFilter, monthFilter])

  const fetchFeeList = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getFeeList(classFilter, sectionFilter, monthFilter)
      if (response.success) {
        setFeeList(response.fees || response.data || [])
      } else if (response.data && Array.isArray(response.data)) {
        setFeeList(response.data)
      } else if (Array.isArray(response)) {
        setFeeList(response)
      } else if (response.fees && Array.isArray(response.fees)) {
        setFeeList(response.fees)
      } else {
        setFeeList([])
        if (response.message && !response.message.toLowerCase().includes('success')) {
          setError(response.message)
        }
      }
    } catch (err) {
      setError(err?.message || err?.data?.message || 'Failed to fetch fee list')
      setFeeList([])
    } finally {
      setLoading(false)
    }
  }

  const getBalanceColor = (balance) => {
    if (balance === 0) return 'text-green-600 dark:text-green-400'
    if (balance < 0) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getStatusBadge = (balance) => {
    if (balance === 0 || balance < 0) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    }
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }

  const getStatusText = (balance) => {
    if (balance === 0) return 'Paid'
    if (balance < 0) return 'Overpaid'
    return 'Pending'
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Fee List</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">receipt_long</span>
          View and track fee records for each student
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined">class</span>
            Class *
          </label>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
          >
            <option value="">-- Select Class --</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined">group</span>
            Section
          </label>
          <input
            type="text"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            placeholder="e.g., A, B, C"
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
          />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined">calendar_month</span>
            Month
          </label>
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
          >
            <option value="">-- All Months --</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex items-end">
          <button
            onClick={() => {
              setClassFilter('')
              setSectionFilter('')
              setMonthFilter('')
              setFeeList([])
            }}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">refresh</span>
            Reset
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-red-700 dark:text-red-300">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#137fec]">sync</span>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Loading fee records...</p>
          </div>
        </div>
      ) : feeList.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-200 dark:border-slate-700 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-600 mx-auto mb-4 flex justify-center">receipt_long</span>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">No fees found</p>
          <p className="text-slate-500 dark:text-slate-500 text-sm">Select a class to view fee records</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-white">Student Details</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-white">Month</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">Total Fee</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">Paid</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">Balance</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {feeList.map((fee, index) => {
                  const totalFee = fee.total_fee || fee.amount || fee.total_amount || 0
                  const paidAmount = fee.paid_amount || fee.paid || fee.total_paid || 0
                  const balance = fee.balance || fee.due || fee.remaining || (totalFee - paidAmount)

                  return (
                    <tr key={fee.id || fee.student_id || index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                      {/* Student Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#137fec] to-blue-600 flex items-center justify-center text-white font-bold">
                            {fee.student_name?.charAt(0)?.toUpperCase() || 'S'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{fee.student_name || 'N/A'}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {fee.class || 'N/A'} / {fee.section || 'N/A'} / Roll: {fee.roll_number || fee.roll || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Month */}
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-lg text-sm font-semibold">
                          {fee.month || 'N/A'}
                        </span>
                      </td>

                      {/* Total Fee with Breakdown */}
                      <td className="px-6 py-4">
                        <div className="relative group">
                          <span className="text-sm font-bold text-slate-900 dark:text-white cursor-help inline-flex items-center gap-1">
                            ₹{totalFee}
                            <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-[#137fec] transition-colors">info</span>
                          </span>
                          <div className="absolute z-10 w-56 p-4 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full mb-2 left-0 pointer-events-none group-hover:pointer-events-auto whitespace-nowrap">
                            <p className="font-bold mb-2 text-sm">Fee Breakdown</p>
                            <div className="space-y-1 text-gray-200">
                              <p>Tuition: ₹{fee.tuition_fee || 0}</p>
                              <p>Exam: ₹{fee.exam_fee || 0}</p>
                              <p>Annual: ₹{fee.annual_fee || 0}</p>
                              <p>Computer: ₹{fee.computer_fee || 0}</p>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Paid Amount */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          ₹{paidAmount}
                        </span>
                      </td>

                      {/* Balance */}
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${getBalanceColor(balance)}`}>
                          ₹{Math.abs(balance)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${getStatusBadge(balance)}`}>
                          <span className="material-symbols-outlined text-sm">
                            {getStatusText(balance) === 'Paid' || getStatusText(balance) === 'Overpaid' ? 'check_circle' : 'schedule'}
                          </span>
                          {getStatusText(balance)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeeList

