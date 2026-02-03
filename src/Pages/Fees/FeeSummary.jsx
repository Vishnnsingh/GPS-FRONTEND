import React, { useState } from 'react'
import { getStudentFeeSummary } from '../../Api/fees'

function FeeSummary() {
  const [studentId, setStudentId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState(null)

  const fetchSummary = async () => {
    if (!studentId) {
      setError('Please enter student id or roll')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await getStudentFeeSummary(String(studentId).trim())
      setSummary(res)
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Failed to fetch summary')
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    if (!summary) return
    let csv = 'Fee Statement\n'
    csv += `Student: ${summary.student.name}\n`
    csv += `Class: ${summary.student.class}-${summary.student.section}\n\n`
    csv += 'Month,Fee,Paid,Balance,Status\n'
    summary.monthly_breakdown.forEach(item => {
      csv += `${item.month},${item.fee},${item.paid},${item.balance},${item.status}\n`
    })

    csv += '\n\nSummary\n'
    csv += `Total Amount,${summary.summary.total_amount}\n`
    csv += `Paid Amount,${summary.summary.paid_amount}\n`
    csv += `Outstanding Balance,${summary.summary.outstanding_balance}\n`
    csv += `Advance Balance,${summary.summary.advance_balance}\n`

    const link = document.createElement('a')
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    link.download = `${summary.student.name}-fee-statement.csv`
    link.click()
  }

  return (
    <div>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
        <div className="flex items-center gap-3">
          <input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Student ID or Roll" className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
          <button onClick={fetchSummary} disabled={loading} className="bg-[#137fec] text-white px-4 py-2 rounded-lg font-bold">{loading ? 'Loading...' : 'Search'}</button>
          {summary && <button onClick={downloadCSV} className="px-3 py-2 rounded-lg border">Download CSV</button>}
        </div>
        {error && <div className="mt-3 text-sm text-red-700">{error}</div>}
      </div>

      {summary && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{summary.student.name}</h3>
              <div className="text-sm text-slate-500">Class {summary.student.class} • Section {summary.student.section || '-'}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Total: <strong className="text-slate-900">₹{summary.summary.total_amount}</strong></div>
              <div className="text-sm text-green-600">Paid: <strong>₹{summary.summary.paid_amount}</strong></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-50 dark:bg-slate-900/20 rounded p-3">
              <div className="text-xs text-slate-500">Outstanding Balance</div>
              <div className="text-xl font-black text-red-600">₹{summary.summary.outstanding_balance}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/20 rounded p-3">
              <div className="text-xs text-slate-500">Advance Balance</div>
              <div className="text-xl font-black text-blue-600">₹{summary.summary.advance_balance}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/20 rounded p-3">
              <div className="text-xs text-slate-500">Status</div>
              <div className="text-xl font-black">{summary.summary.status.replace(/_/g, ' ')}</div>
            </div>
          </div>

          <h4 className="font-bold mb-2">Monthly Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="text-left">Month</th>
                  <th>Fee</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Advance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {summary.monthly_breakdown.map((m, i) => (
                  <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="py-2">{m.month}</td>
                    <td className="text-center">₹{m.fee}</td>
                    <td className="text-center text-green-600">₹{m.paid}</td>
                    <td className="text-center text-red-600">₹{m.balance}</td>
                    <td className="text-center text-blue-600">₹{m.advance || 0}</td>
                    <td className="text-center">{m.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeeSummary
