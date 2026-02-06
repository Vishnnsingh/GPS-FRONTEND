import React, { useState, useEffect } from 'react'
import { getFeeList } from '../../Api/fees'

function FeeList() {
  const [feeList, setFeeList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')
  const [monthFilter, setMonthFilter] = useState('')

  useEffect(() => {
    if (classFilter || monthFilter) {
      fetchFeeList()
    }
  }, [classFilter, sectionFilter, monthFilter])

  const fetchFeeList = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getFeeList(classFilter, sectionFilter, monthFilter)
      // Handle different response structures
      if (response.success) {
        setFeeList(response.fees || response.data || [])
      } else if (response.data && Array.isArray(response.data)) {
        // API returns { message, data: [...] }
        setFeeList(response.data)
      } else if (Array.isArray(response)) {
        // API returns array directly
        setFeeList(response)
      } else if (response.fees && Array.isArray(response.fees)) {
        // API returns { fees: [...] }
        setFeeList(response.fees)
      } else {
        setFeeList([])
        // Show message but don't treat as error if it's just informational
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fee List</h3>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class</label>
          <input
            type="text"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            placeholder="Filter by class"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section</label>
          <input
            type="text"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            placeholder="Filter by section"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Month</label>
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setClassFilter('')
              setSectionFilter('')
              setMonthFilter('')
              setFeeList([])
            }}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <span className="material-symbols-outlined animate-spin text-3xl text-[#137fec]">sync</span>
        </div>
      ) : feeList.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">
          {classFilter || monthFilter ? 'No fees found. Try adjusting filters.' : 'Enter filters to view fee list'}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left font-bold text-slate-900 dark:text-white">Student</th>
                <th className="px-4 py-3 text-left font-bold text-slate-900 dark:text-white">Class</th>
                <th className="px-4 py-3 text-left font-bold text-slate-900 dark:text-white">Section</th>
                <th className="px-4 py-3 text-left font-bold text-slate-900 dark:text-white">Month</th>
                <th className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">Total Fee</th>
                <th className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">Paid</th>
                <th className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">Balance</th>
                <th className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {feeList.map((fee, index) => {
                const totalFee = fee.total_fee || fee.amount || fee.total_amount || 0
                const paidAmount = fee.paid_amount || fee.paid || fee.total_paid || 0
                const balance = fee.balance || fee.due || fee.remaining || (totalFee - paidAmount)
                const isPaid = balance === 0 || balance <= 0
                
                return (
                  <tr key={fee.id || fee.student_id || index} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-4 py-3 text-slate-900 dark:text-white">
                      {fee.student_name || fee.name || '--'}
                    </td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white">{fee.class || '--'}</td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white">{fee.section || '--'}</td>
                    <td className="px-4 py-3 text-slate-900 dark:text-white">{fee.month || '--'}</td>
                    <td className="px-4 py-3 text-right text-slate-900 dark:text-white font-medium">
                      ₹{totalFee}
                    </td>
                    <td className="px-4 py-3 text-right text-green-600 dark:text-green-400 font-medium">
                      ₹{paidAmount}
                    </td>
                    <td className="px-4 py-3 text-right text-red-600 dark:text-red-400 font-medium">
                      ₹{balance}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {totalFee > 0 ? (
                        isPaid ? (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">Paid</span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs">Pending</span>
                        )
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-300 rounded-full text-xs">No Fee</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default FeeList

