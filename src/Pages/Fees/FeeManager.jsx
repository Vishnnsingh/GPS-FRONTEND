import React, { useState } from 'react'
import FeeStructure from './FeeStructure'
import BulkBillGeneration from './BulkBillGeneration'
import FeeList from './FeeList'
import PayFees from './PayFees'
import Invoice from './Invoice'
import Bills from './Bills'

function FeeManager() {
  const [activeTab, setActiveTab] = useState('structure')

  const tabs = [
    { id: 'structure', label: 'Fee Structure', icon: 'settings' },
    { id: 'bulk', label: 'Bulk Bills', icon: 'receipt_long' },
    { id: 'list', label: 'Fee List', icon: 'list' },
    { id: 'pay', label: 'Pay Fees', icon: 'payments' },
    { id: 'invoice', label: 'Invoice', icon: 'description' },
    { id: 'bills', label: 'Bills', icon: 'print' }
  ]

  return (
    <div className="space-y-4" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Fees Management</h2>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-[#137fec] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        {activeTab === 'structure' && <FeeStructure />}
        {activeTab === 'bulk' && <BulkBillGeneration />}
        {activeTab === 'list' && <FeeList />}
        {activeTab === 'pay' && <PayFees />}
        {activeTab === 'invoice' && <Invoice />}
        {activeTab === 'bills' && <Bills />}
      </div>
    </div>
  )
}

export default FeeManager

