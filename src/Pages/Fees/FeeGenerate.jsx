import React, { useState } from 'react'
import { generateInvoices } from '../../Api/fees'

const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

function FeeGenerate() {
  const [className, setClassName] = useState('')
  const [section, setSection] = useState('')
  const [month, setMonth] = useState(months[new Date().getMonth()])
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleGenerate = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    if (!className || !month || !amount) {
      setError('Please provide Class, Month and Amount')
      return
    }
    try {
      setLoading(true)
      const res = await generateInvoices({ className: String(className).trim(), month, amount: Number(amount), section: section ? String(section).trim() : undefined })
      setResult(res)
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Failed to generate invoices')
    } finally {
      setLoading(false)
    }
  }

  // Quick CSV export for generated invoices
  const downloadCSV = (invoices) => {
    if (!invoices || invoices.length === 0) return
    let csv = 'InvoiceNo,StudentName,Class,Section,Roll,Month,Amount,Status\n'
    invoices.forEach(inv => {
      csv += `${inv.invoice_no},"${inv.student.name}",${inv.student.class || ''},${inv.student.section || ''},${inv.student.roll_no || ''},${inv.month},${inv.amount},${inv.status}\n`
    })
    const link = document.createElement('a')
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    link.download = `invoices-${month}-${className}.csv`
    link.click()
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Generate Fee Invoices</h3>
      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold mb-1">Class</label>
            <input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g., 10" className="w-full px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Section (optional)</label>
            <input value={section} onChange={(e) => setSection(e.target.value)} placeholder="A" className="w-full px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Month</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Amount</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="e.g., 4500" className="w-full px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
        </div>

        {error && <div className="text-sm text-red-700 bg-red-50 dark:bg-red-900/20 p-3 rounded">{error}</div>}

        <div className="flex items-center gap-3">
          <button disabled={loading} className="bg-[#137fec] text-white px-4 py-2 rounded font-bold">{loading ? 'Generating...' : 'Generate Invoices'}</button>
          <button type="button" onClick={() => { setClassName(''); setSection(''); setAmount(''); setResult(null); setError('') }} className="px-3 py-2 rounded border">Reset</button>
        </div>
      </form>

      {result && (
        <div className="mt-6 bg-slate-50 dark:bg-slate-900/20 p-4 rounded">
          <p className="font-bold">{result.message || 'Invoices generated'}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Created {result?.invoices?.length || 0} invoices.</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => downloadCSV(result.invoices)} className="px-3 py-1 rounded bg-[#137fec] text-white text-sm">Download CSV</button>
            <a href="/dashboard" className="px-3 py-1 rounded border text-sm">View Invoices</a>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeeGenerate