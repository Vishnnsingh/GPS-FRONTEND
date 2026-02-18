import React, { useState } from 'react'
import FeeStructure from './FeeStructure'
import BulkBillGeneration from './BulkBillGeneration'
import FeeList from './FeeList'
import PayFees from './PayFees'
import Invoice from './Invoice'
import Bills from './Bills'
import FeesDashboard from './FeesDashboard'

function FeeManager() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Fees Dashboard', icon: 'dashboard' },
    { id: 'structure', label: 'Fee Structure', icon: 'settings' },
    { id: 'bulk', label: 'Bulk Bills', icon: 'receipt_long' },
    { id: 'list', label: 'Fee List', icon: 'list' },
    { id: 'pay', label: 'Pay Fees', icon: 'payments' },
    { id: 'invoice', label: 'Invoice', icon: 'description' },
    { id: 'bills', label: 'Bills', icon: 'print' }
  ]

  return (
    <div className="space-y-6" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Fees Management</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">card_giftcard</span>
            Manage all fee structures, collections and records
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#137fec] to-blue-600 text-white shadow-md scale-105'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'dashboard' && <FeesDashboard />}
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