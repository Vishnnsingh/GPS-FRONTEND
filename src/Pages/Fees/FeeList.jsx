import React, { useEffect, useState } from 'react'
import { getFeesByClass } from '../../Api/fees'

const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

function FeeList() {
  const [className, setClassName] = useState('')
  const [section, setSection] = useState('')
  const [month, setMonth] = useState(months[new Date().getMonth()])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fees, setFees] = useState([])

  const fetch = async () => {
    setError('')
    setFees([])
    if (!className) {
      setError('Please provide a class to search')
      return
    }
    try {
      setLoading(true)
      const res = await getFeesByClass({ className: String(className).trim(), month, section: section ? String(section).trim() : undefined })
      setFees(res?.fees || res?.data || [])
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Failed to fetch fees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // no auto-fetch
  }, [])

  return (
    <div>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Class Fee List</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input placeholder="Class (e.g., 10)" value={className} onChange={e => setClassName(e.target.value)} className="px-3 py-2 rounded border" />
          <input placeholder="Section (optional)" value={section} onChange={e => setSection(e.target.value)} className="px-3 py-2 rounded border" />
          <select value={month} onChange={e => setMonth(e.target.value)} className="px-3 py-2 rounded border">
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <button onClick={fetch} className="px-3 py-2 rounded bg-[#137fec] text-white">Search</button>
            <button onClick={() => { setClassName(''); setSection(''); setFees([]); setError('') }} className="px-3 py-2 rounded border">Reset</button>
          </div>
        </div>
      </div>

      {error && <div className="text-sm text-red-700 mb-3">{error}</div>}

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        {loading ? (
          <p className="text-sm">Loading...</p>
        ) : fees.length === 0 ? (
          <p className="text-sm text-slate-500">No fee records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500">
                  <th className="text-left">Student</th>
                  <th className="text-center">Roll</th>
                  <th className="text-center">Section</th>
                  <th className="text-center">Total Fee</th>
                  <th className="text-center">Paid</th>
                  <th className="text-center">Balance</th>
                  <th className="text-center">Advance</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f, i) => (
                  <tr key={f.id || i} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="py-2">{f.student?.name || f.student_name || '—'}</td>
                    <td className="text-center">{f.student?.roll_no || f.roll || '—'}</td>
                    <td className="text-center">{f.student?.section || f.section || '—'}</td>
                    <td className="text-center">₹{f.total_fee ?? f.amount ?? '--'}</td>
                    <td className="text-center text-green-600">₹{f.paid_amount ?? f.paid ?? 0}</td>
                    <td className="text-center text-red-600">₹{f.balance ?? f.balance_due ?? 0}</td>
                    <td className="text-center text-blue-600">₹{f.advance ?? 0}</td>
                    <td className="text-center">{f.status || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeeList
