import React, { useState } from 'react'
import { getInvoiceDetails, downloadInvoicePDF } from '../../Api/fees'

function Invoice() {
  const [billId, setBillId] = useState('')
  const [invoiceData, setInvoiceData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFetchInvoice = async () => {
    if (!billId.trim()) {
      setError('Please enter a Bill ID')
      return
    }

    setError('')
    setLoading(true)
    setInvoiceData(null)

    try {
      const response = await getInvoiceDetails(billId.trim())
      if (response.success) {
        setInvoiceData(response.invoice || response.data)
      } else {
        setError(response.message || 'Failed to fetch invoice')
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch invoice')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!billId.trim()) {
      setError('Please enter a Bill ID')
      return
    }

    setError('')
    setLoading(true)

    try {
      const blob = await downloadInvoicePDF(billId.trim())
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${billId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err?.message || 'Failed to download invoice PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Invoice Details</h3>

      {/* Search */}
      <div className="flex gap-3">
        <input
          type="text"
          value={billId}
          onChange={(e) => setBillId(e.target.value)}
          placeholder="Enter Bill ID"
          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        />
        <button
          onClick={handleFetchInvoice}
          disabled={loading}
          className="px-4 py-2 bg-[#137fec] text-white rounded-lg hover:bg-[#137fec]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
              Loading...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">search</span>
              View Invoice
            </>
          )}
        </button>
        {invoiceData && (
          <button
            onClick={handleDownloadPDF}
            disabled={loading}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Download PDF
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Invoice Details */}
      {invoiceData && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-6">
          {/* Student Info */}
          <div>
            <h4 className="text-md font-bold text-slate-900 dark:text-white mb-3">Student Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600 dark:text-slate-400">Name:</span>
                <span className="ml-2 font-medium text-slate-900 dark:text-white">
                  {invoiceData.student?.name || invoiceData.student_name || '--'}
                </span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Class:</span>
                <span className="ml-2 font-medium text-slate-900 dark:text-white">
                  {invoiceData.class || invoiceData.student?.class || '--'}
                </span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Section:</span>
                <span className="ml-2 font-medium text-slate-900 dark:text-white">
                  {invoiceData.section || invoiceData.student?.section || '--'}
                </span>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Month:</span>
                <span className="ml-2 font-medium text-slate-900 dark:text-white">
                  {invoiceData.month || '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Bill Items */}
          {invoiceData.items && invoiceData.items.length > 0 && (
            <div>
              <h4 className="text-md font-bold text-slate-900 dark:text-white mb-3">Bill Items</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                      <th className="px-4 py-2 text-left font-bold text-slate-900 dark:text-white">Item</th>
                      <th className="px-4 py-2 text-right font-bold text-slate-900 dark:text-white">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item, index) => (
                      <tr key={index} className="border-b border-slate-200 dark:border-slate-700">
                        <td className="px-4 py-2 text-slate-900 dark:text-white">{item.fee_name || item.name || '--'}</td>
                        <td className="px-4 py-2 text-right text-slate-900 dark:text-white">₹{item.amount || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments */}
          {invoiceData.payments && invoiceData.payments.length > 0 && (
            <div>
              <h4 className="text-md font-bold text-slate-900 dark:text-white mb-3">Payments</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                      <th className="px-4 py-2 text-left font-bold text-slate-900 dark:text-white">Date</th>
                      <th className="px-4 py-2 text-left font-bold text-slate-900 dark:text-white">Mode</th>
                      <th className="px-4 py-2 text-right font-bold text-slate-900 dark:text-white">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.payments.map((payment, index) => (
                      <tr key={index} className="border-b border-slate-200 dark:border-slate-700">
                        <td className="px-4 py-2 text-slate-900 dark:text-white">
                          {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : '--'}
                        </td>
                        <td className="px-4 py-2 text-slate-900 dark:text-white capitalize">
                          {payment.payment_mode || '--'}
                        </td>
                        <td className="px-4 py-2 text-right text-green-600 dark:text-green-400 font-medium">
                          ₹{payment.amount_paid || payment.amount || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Total Fee:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                ₹{invoiceData.total_fee || invoiceData.total_amount || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Paid:</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                ₹{invoiceData.paid_amount || invoiceData.total_paid || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-slate-200 dark:border-slate-700 pt-2">
              <span className="text-slate-600 dark:text-slate-400">Balance:</span>
              <span className="font-bold text-red-600 dark:text-red-400">
                ₹{invoiceData.balance || invoiceData.due || 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Invoice

