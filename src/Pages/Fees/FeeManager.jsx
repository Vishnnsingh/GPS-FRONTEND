import React, { useState } from 'react'
import PayFees from './PayFees'
import FeeSummary from './FeeSummary'
import FeeGenerate from './FeeGenerate'
import InvoicesList from './InvoicesList'
import FeeList from './FeeList'

function FeeManager() {
  const [tab, setTab] = useState('pay')

  return (
    <div style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Fees & Advance</h2>
          <div className="inline-flex rounded bg-slate-100 dark:bg-slate-900 p-1">
            <button onClick={() => setTab('generate')} className={`px-3 py-1 rounded ${tab === 'generate' ? 'bg-[#137fec] text-white' : 'text-slate-700 dark:text-slate-300'}`}>Generate Invoices</button>
            <button onClick={() => setTab('invoices')} className={`px-3 py-1 rounded ${tab === 'invoices' ? 'bg-[#137fec] text-white' : 'text-slate-700 dark:text-slate-300'}`}>Invoices</button>
            <button onClick={() => setTab('list')} className={`px-3 py-1 rounded ${tab === 'list' ? 'bg-[#137fec] text-white' : 'text-slate-700 dark:text-slate-300'}`}>Fee List</button>
            <button onClick={() => setTab('pay')} className={`px-3 py-1 rounded ${tab === 'pay' ? 'bg-[#137fec] text-white' : 'text-slate-700 dark:text-slate-300'}`}>Process Payment</button>
            <button onClick={() => setTab('summary')} className={`px-3 py-1 rounded ${tab === 'summary' ? 'bg-[#137fec] text-white' : 'text-slate-700 dark:text-slate-300'}`}>Summary</button>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Manage student fee payments, create advances and view summarized fee history.</p>
      </div>

      {tab === 'generate' && <FeeGenerate />}
      {tab === 'invoices' && <InvoicesList />}
      {tab === 'list' && <FeeList />}
      {tab === 'pay' && <PayFees />}
      {tab === 'summary' && <FeeSummary />}
    </div>
  )
}

export default FeeManager
