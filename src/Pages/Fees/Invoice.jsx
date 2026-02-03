import React, { useEffect, useState } from 'react'
import { getInvoice } from '../../Api/fees'
import { useParams } from 'react-router-dom'

function Invoice({ invoice }) {
  // If invoice prop not passed, fetch by route id
  const params = useParams()
  const [data, setData] = useState(invoice || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const run = async () => {
      if (!data && params?.id) {
        try {
          setLoading(true)
          const res = await getInvoice(params.id)
          setData(res)
        } catch (err) {
          setError(err?.data?.message || err?.message || 'Failed to load invoice')
        } finally {
          setLoading(false)
        }
      }
    }
    run()
  }, [params, data])

  const handlePrint = () => {
    window.print()
  }

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-700">{error}</div>
  if (!data) return <div className="p-4 text-slate-500">Invoice not found</div>

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">{import.meta.env.VITE_SCHOOL_NAME || 'GJ Public School'}</h2>
          <div className="text-sm text-slate-500">{import.meta.env.VITE_SCHOOL_ADDRESS || 'School Address'}</div>
        </div>
        <div className="text-right">
          <div className="text-sm">Invoice No: <strong>{data.invoice_no}</strong></div>
          <div className="text-sm">Issue Date: {data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-IN') : '-'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-500">Student</div>
          <div className="font-bold text-slate-900 dark:text-white">{data.student?.name || '-'}</div>
          <div className="text-sm text-slate-500">Class {data.student?.class || data.class} • Section {data.student?.section || '-'}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Month</div>
          <div className="font-bold">{data.month}</div>
          <div className="text-sm text-slate-500">Roll: {data.student?.roll_no || '-'}</div>
        </div>
      </div>

      <div className="mb-4">
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500">
            <tr>
              <th className="text-left">Description</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200 dark:border-slate-700">
              <td className="py-2">Monthly Fee ({data.month})</td>
              <td className="text-right">₹{data.amount}</td>
            </tr>
            <tr className="border-t border-slate-200 dark:border-slate-700">
              <td className="py-2 font-bold">Total</td>
              <td className="text-right font-bold">₹{data.amount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">Status: <strong className="text-slate-900 dark:text-white">{data.status}</strong></div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="px-3 py-2 bg-[#137fec] text-white rounded">Print</button>
          <a href="/dashboard" className="px-3 py-2 rounded border">Back</a>
        </div>
      </div>
    </div>
  )
}

export default Invoice