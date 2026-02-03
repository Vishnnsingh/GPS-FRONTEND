import React, { useEffect, useState } from 'react'
import { getInvoices, markInvoicePaid, getInvoice } from '../../Api/fees'

function InvoicesList() {
  const [filters, setFilters] = useState({ className: '', month: '', status: '' })
  const [loading, setLoading] = useState(false)
  const [invoices, setInvoices] = useState([])
  const [error, setError] = useState('')

  const fetch = async () => {
    setError('')
    try {
      setLoading(true)
      const res = await getInvoices({ className: filters.className, month: filters.month, status: filters.status })
      setInvoices(res?.invoices || [])
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  const handleMarkPaid = async (invoiceId) => {
    try {
      setLoading(true)
      await markInvoicePaid(invoiceId)
      fetch()
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Failed to mark paid')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Invoices</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input placeholder="Class" value={filters.className} onChange={e => setFilters(f => ({ ...f, className: e.target.value }))} className="px-3 py-2 rounded border" />
          <input placeholder="Month" value={filters.month} onChange={e => setFilters(f => ({ ...f, month: e.target.value }))} className="px-3 py-2 rounded border" />
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} className="px-3 py-2 rounded border">
            <option value="">All</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
            <option value="ADVANCE">Advance</option>
          </select>
          <div className="flex items-center gap-2">
            <button onClick={fetch} className="px-3 py-2 rounded bg-[#137fec] text-white">Search</button>
            <button onClick={() => { setFilters({ className: '', month: '', status: '' }); fetch() }} className="px-3 py-2 rounded border">Reset</button>
          </div>
        </div>
      </div>

      {error && <div className="text-sm text-red-700 mb-3">{error}</div>}

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        {loading ? (
          <p className="text-sm">Loading...</p>
        ) : invoices.length === 0 ? (
          <p className="text-sm text-slate-500">No invoices found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500">
                  <th className="text-left">Invoice No</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="py-2">{inv.invoice_no}</td>
                    <td>{inv.student?.name || '—'}</td>
                    <td className="text-center">{inv.student?.class || inv.class}</td>
                    <td className="text-center">{inv.month}</td>
                    <td className="text-center">₹{inv.amount}</td>
                    <td className="text-center">{inv.status}</td>
                    <td className="text-center">
                      <a href={`/invoice/${inv.id}`} target="_blank" rel="noreferrer" className="text-sm text-[#137fec] hover:underline mr-2">View</a>
                      {inv.status !== 'PAID' && <button onClick={() => handleMarkPaid(inv.id)} className="px-2 py-1 text-xs rounded bg-green-600 text-white">Mark Paid</button>}
                    </td>
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

export default InvoicesList