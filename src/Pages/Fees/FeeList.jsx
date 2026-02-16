import React, { useState, useEffect } from 'react'
import { getFeeList } from '../../Api/fees'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function FeeList({ onViewInvoice }) {
  const [feeList, setFeeList] = useState([])
  const [filteredFeeList, setFilteredFeeList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')
  const [monthFilter, setMonthFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'paid', 'unpaid', 'partial'
  const [totalCount, setTotalCount] = useState(0)

  // Apply status filter when statusFilter or feeList changes
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredFeeList(feeList)
    } else {
      const filtered = feeList.filter((fee) => {
        const totalFee = fee.total_fee || 0
        const paidAmount = fee.total_paid || fee.paid_amount || 0
        const netPayable = fee.net_payable || fee.balance || (totalFee - paidAmount)
        const billStatus = fee.bill_status || (netPayable === 0 ? 'paid' : 'unpaid')
        
        if (statusFilter === 'paid') {
          return billStatus === 'paid' || netPayable === 0 || netPayable < 0
        } else if (statusFilter === 'unpaid') {
          return billStatus === 'unpaid' && netPayable > 0
        } else if (statusFilter === 'partial') {
          return billStatus === 'partial' || (paidAmount > 0 && netPayable > 0)
        }
        return true
      })
      setFilteredFeeList(filtered)
    }
  }, [statusFilter, feeList])

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
        setTotalCount(response.count || (response.fees || response.data || []).length)
      } else if (response.data && Array.isArray(response.data)) {
        // API returns { message, data: [...], count: ... }
        setFeeList(response.data)
        setTotalCount(response.count || response.data.length)
      } else if (Array.isArray(response)) {
        // API returns array directly
        setFeeList(response)
        setTotalCount(response.length)
      } else if (response.fees && Array.isArray(response.fees)) {
        // API returns { fees: [...] }
        setFeeList(response.fees)
        setTotalCount(response.count || response.fees.length)
      } else {
        setFeeList([])
        setTotalCount(0)
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

  const handleDownloadPDF = () => {
    if (filteredFeeList.length === 0) {
      setError('No data available to download')
      return
    }

    try {
      const doc = new jsPDF('landscape', 'mm', 'a4')
      
      // Title
      doc.setFontSize(18)
      doc.text('Fee List Report', 14, 15)
      
      // Filter info
      doc.setFontSize(10)
      let yPos = 22
      const filters = []
      if (classFilter) filters.push(`Class: ${classFilter}`)
      if (sectionFilter) filters.push(`Section: ${sectionFilter}`)
      if (monthFilter) filters.push(`Month: ${monthFilter}`)
      if (statusFilter !== 'all') filters.push(`Status: ${statusFilter}`)
      
      if (filters.length > 0) {
        doc.text(`Filters: ${filters.join(', ')}`, 14, yPos)
        yPos += 5
      }
      doc.text(`Total Records: ${filteredFeeList.length}`, 14, yPos)
      yPos += 8

      // Helper function to format numbers
      const formatCurrency = (value) => {
        const num = parseFloat(value) || 0
        return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      }

      // Prepare table data
      const tableData = filteredFeeList.map((fee) => {
        const totalFee = parseFloat(fee.total_fee) || 0
        const paidAmount = parseFloat(fee.total_paid || fee.paid_amount) || 0
        const netPayable = parseFloat(fee.net_payable || fee.balance) || (totalFee - paidAmount)
        const billStatus = fee.bill_status || (netPayable === 0 ? 'paid' : netPayable < 0 ? 'paid' : 'unpaid')
        
        return [
          fee.student_name || '--',
          String(fee.roll_no || '--'),
          fee.class || '--',
          fee.section || '--',
          fee.month || '--',
          formatCurrency(fee.tuition_fee || 0),
          formatCurrency(fee.exam_fee || 0),
          formatCurrency(fee.annual_fee || 0),
          formatCurrency(fee.computer_fee || 0),
          formatCurrency(fee.transport_fee || 0),
          formatCurrency(fee.previous_due || 0),
          formatCurrency(totalFee),
          formatCurrency(paidAmount),
          formatCurrency(netPayable),
          billStatus.charAt(0).toUpperCase() + billStatus.slice(1)
        ]
      })

      // Add summary row
      const totals = {
        tuition: filteredFeeList.reduce((sum, f) => sum + (parseFloat(f.tuition_fee) || 0), 0),
        exam: filteredFeeList.reduce((sum, f) => sum + (parseFloat(f.exam_fee) || 0), 0),
        annual: filteredFeeList.reduce((sum, f) => sum + (parseFloat(f.annual_fee) || 0), 0),
        computer: filteredFeeList.reduce((sum, f) => sum + (parseFloat(f.computer_fee) || 0), 0),
        transport: filteredFeeList.reduce((sum, f) => sum + (parseFloat(f.transport_fee) || 0), 0),
        prevDue: filteredFeeList.reduce((sum, f) => sum + (parseFloat(f.previous_due) || 0), 0),
        totalFee: filteredFeeList.reduce((sum, f) => sum + (parseFloat(f.total_fee) || 0), 0),
        totalPaid: filteredFeeList.reduce((sum, f) => sum + (parseFloat(f.total_paid || f.paid_amount) || 0), 0),
        netPayable: filteredFeeList.reduce((sum, f) => {
          const totalFee = parseFloat(f.total_fee) || 0
          const paidAmount = parseFloat(f.total_paid || f.paid_amount) || 0
          const netPayable = parseFloat(f.net_payable || f.balance) || (totalFee - paidAmount)
          return sum + netPayable
        }, 0)
      }

      tableData.push([
        `Total (${filteredFeeList.length})`,
        '',
        '',
        '',
        '',
        formatCurrency(totals.tuition),
        formatCurrency(totals.exam),
        formatCurrency(totals.annual),
        formatCurrency(totals.computer),
        formatCurrency(totals.transport),
        formatCurrency(totals.prevDue),
        formatCurrency(totals.totalFee),
        formatCurrency(totals.totalPaid),
        formatCurrency(totals.netPayable),
        ''
      ])

      // Generate table
      autoTable(doc, {
        startY: yPos,
        head: [['Student', 'Roll', 'Class', 'Section', 'Month', 'Tuition', 'Exam', 'Annual', 'Computer', 'Transport', 'Prev Due', 'Total Fee', 'Paid', 'Net Payable', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [19, 127, 236], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 7, cellPadding: 1.5, overflow: 'linebreak', cellWidth: 'wrap' },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 12, halign: 'center' },
          2: { cellWidth: 12, halign: 'center' },
          3: { cellWidth: 12, halign: 'center' },
          4: { cellWidth: 18, halign: 'center' },
          5: { cellWidth: 15, halign: 'right' },
          6: { cellWidth: 15, halign: 'right' },
          7: { cellWidth: 15, halign: 'right' },
          8: { cellWidth: 15, halign: 'right' },
          9: { cellWidth: 15, halign: 'right' },
          10: { cellWidth: 15, halign: 'right' },
          11: { cellWidth: 18, halign: 'right' },
          12: { cellWidth: 18, halign: 'right' },
          13: { cellWidth: 18, halign: 'right' },
          14: { cellWidth: 15, halign: 'center' }
        },
        margin: { top: yPos, left: 14, right: 14 },
        didDrawPage: function (data) {
          // Footer
          doc.setFontSize(8)
          doc.text(
            `Generated on: ${new Date().toLocaleString()}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          )
        }
      })

      // Generate filename
      const filename = `fee-list-${classFilter || 'all'}-${sectionFilter || 'all'}-${monthFilter || 'all'}-${statusFilter}-${new Date().toISOString().split('T')[0]}.pdf`
      
      // Save PDF
      doc.save(filename)
    } catch (err) {
      setError('Failed to generate PDF: ' + (err?.message || 'Unknown error'))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fee List</h3>
        <div className="flex items-center gap-2">
          {feeList.length > 0 && (
            <>
              <span className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                Total: {totalCount} {totalCount === 1 ? 'record' : 'records'}
              </span>
              {statusFilter !== 'all' && filteredFeeList.length !== feeList.length && (
                <span className="text-sm text-[#137fec] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full font-medium">
                  Showing: {filteredFeeList.length} {filteredFeeList.length === 1 ? 'record' : 'records'}
                </span>
              )}
            </>
          )}
          {filteredFeeList.length > 0 && (
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
              Download PDF
            </button>
          )}
        </div>
      </div>

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
              setStatusFilter('all')
              setFeeList([])
              setFilteredFeeList([])
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

      {/* Status Filter - Always Visible */}
      {feeList.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filter by Status:</span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    statusFilter === 'all'
                      ? 'bg-[#137fec] text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">apps</span>
                  All
                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                    statusFilter === 'all' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'
                  }`}>
                    {feeList.length}
                  </span>
                </button>
                <button
                  onClick={() => setStatusFilter('paid')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    statusFilter === 'paid'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Paid
                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                    statusFilter === 'paid' ? 'bg-white/20' : 'bg-emerald-50 dark:bg-emerald-900/20'
                  }`}>
                    {feeList.filter(f => {
                      const netPayable = f.net_payable || f.balance || ((f.total_fee || 0) - (f.total_paid || 0))
                      return f.bill_status === 'paid' || netPayable === 0 || netPayable < 0
                    }).length}
                  </span>
                </button>
                <button
                  onClick={() => setStatusFilter('unpaid')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    statusFilter === 'unpaid'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-rose-200 dark:border-rose-700/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  Unpaid
                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                    statusFilter === 'unpaid' ? 'bg-white/20' : 'bg-rose-50 dark:bg-rose-900/20'
                  }`}>
                    {feeList.filter(f => {
                      const netPayable = f.net_payable || f.balance || ((f.total_fee || 0) - (f.total_paid || 0))
                      return f.bill_status === 'unpaid' && netPayable > 0
                    }).length}
                  </span>
                </button>
                <button
                  onClick={() => setStatusFilter('partial')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                    statusFilter === 'partial'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">pending</span>
                  Partial
                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                    statusFilter === 'partial' ? 'bg-white/20' : 'bg-amber-50 dark:bg-amber-900/20'
                  }`}>
                    {feeList.filter(f => {
                      const paidAmount = f.total_paid || f.paid_amount || 0
                      const netPayable = f.net_payable || f.balance || ((f.total_fee || 0) - paidAmount)
                      return f.bill_status === 'partial' || (paidAmount > 0 && netPayable > 0)
                    }).length}
                  </span>
                </button>
              </div>
            </div>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">close</span>
                Clear filter
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <span className="material-symbols-outlined animate-spin text-3xl text-[#137fec]">sync</span>
        </div>
      ) : filteredFeeList.length === 0 && feeList.length > 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">
          No fees found with status "{statusFilter}". Try selecting a different status filter.
        </p>
      ) : filteredFeeList.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">
          {classFilter || monthFilter ? 'No fees found. Try adjusting filters.' : 'Enter filters to view fee list'}
        </p>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-300 dark:border-slate-600">
                <th className="px-4 py-3 text-left font-bold text-slate-900 dark:text-white sticky left-0 bg-slate-100 dark:bg-slate-900 z-10 border-r-2 border-slate-300 dark:border-slate-600">Student</th>
                <th className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">Roll</th>
                <th className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">Class</th>
                <th className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">Section</th>
                <th className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">Month</th>
                <th className="px-3 py-3 text-right font-bold text-slate-900 dark:text-white">Tuition</th>
                <th className="px-3 py-3 text-right font-bold text-slate-900 dark:text-white">Exam</th>
                <th className="px-3 py-3 text-right font-bold text-slate-900 dark:text-white">Annual</th>
                <th className="px-3 py-3 text-right font-bold text-slate-900 dark:text-white">Computer</th>
                <th className="px-3 py-3 text-right font-bold text-slate-900 dark:text-white">Transport</th>
                <th className="px-3 py-3 text-right font-bold text-slate-900 dark:text-white">Prev Due</th>
                <th className="px-3 py-3 text-right font-bold text-slate-900 dark:text-white bg-blue-50 dark:bg-blue-900/20">Total Fee</th>
                <th className="px-3 py-3 text-right font-bold text-green-600 dark:text-green-400">Paid</th>
                <th className="px-3 py-3 text-right font-bold text-red-600 dark:text-red-400">Net Payable</th>
                <th className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">Status</th>
                <th className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeeList.map((fee, index) => {
                const totalFee = fee.total_fee || 0
                const paidAmount = fee.total_paid || fee.paid_amount || 0
                const netPayable = fee.net_payable || fee.balance || (totalFee - paidAmount)
                const billStatus = fee.bill_status || (netPayable === 0 ? 'paid' : 'unpaid')
                const isPaid = billStatus === 'paid' || netPayable === 0
                
                return (
                  <tr key={fee.bill_id || fee.student_id || index} className="border-b border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3 text-slate-900 dark:text-white font-medium sticky left-0 bg-white dark:bg-slate-800 z-10 border-r-2 border-slate-300 dark:border-slate-600 shadow-[2px_0_4px_rgba(0,0,0,0.05)]">
                      <div>
                        <div className="font-semibold">{fee.student_name || '--'}</div>
                        {fee.father_name && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">{fee.father_name}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-slate-900 dark:text-white">{fee.roll_no || '--'}</td>
                    <td className="px-3 py-3 text-center text-slate-900 dark:text-white font-medium">{fee.class || '--'}</td>
                    <td className="px-3 py-3 text-center text-slate-900 dark:text-white">{fee.section || '--'}</td>
                    <td className="px-3 py-3 text-center text-slate-900 dark:text-white">{fee.month || '--'}</td>
                    <td className="px-3 py-3 text-right text-slate-700 dark:text-slate-300">₹{fee.tuition_fee || 0}</td>
                    <td className="px-3 py-3 text-right text-slate-700 dark:text-slate-300">₹{fee.exam_fee || 0}</td>
                    <td className="px-3 py-3 text-right text-slate-700 dark:text-slate-300">₹{fee.annual_fee || 0}</td>
                    <td className="px-3 py-3 text-right text-slate-700 dark:text-slate-300">₹{fee.computer_fee || 0}</td>
                    <td className="px-3 py-3 text-right text-slate-700 dark:text-slate-300">₹{fee.transport_fee || 0}</td>
                    <td className="px-3 py-3 text-right text-orange-600 dark:text-orange-400 font-medium">₹{fee.previous_due || 0}</td>
                    <td className="px-3 py-3 text-right text-slate-900 dark:text-white font-bold bg-blue-50 dark:bg-blue-900/20">
                      ₹{totalFee}
                    </td>
                    <td className="px-3 py-3 text-right text-green-600 dark:text-green-400 font-bold">
                      ₹{paidAmount}
                    </td>
                    <td className="px-3 py-3 text-right text-red-600 dark:text-red-400 font-bold">
                      ₹{netPayable}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {billStatus === 'paid' || isPaid ? (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold">Paid</span>
                      ) : billStatus === 'partial' ? (
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-semibold">Partial</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs font-semibold">Unpaid</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {fee.bill_id && onViewInvoice && (
                        <button
                          onClick={() => onViewInvoice(fee.bill_id)}
                          className="px-3 py-1.5 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors flex items-center gap-1.5 text-xs font-medium"
                          title="View Invoice"
                        >
                          <span className="material-symbols-outlined text-sm">description</span>
                          Invoice
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            {/* Summary Row */}
            {filteredFeeList.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 font-semibold">
                  <td colSpan={6} className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">Total ({filteredFeeList.length} {filteredFeeList.length === 1 ? 'record' : 'records'}):</td>
                  <td className="px-3 py-3 text-right text-slate-900 dark:text-white">₹{filteredFeeList.reduce((sum, f) => sum + (f.tuition_fee || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-right text-slate-900 dark:text-white">₹{filteredFeeList.reduce((sum, f) => sum + (f.exam_fee || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-right text-slate-900 dark:text-white">₹{filteredFeeList.reduce((sum, f) => sum + (f.annual_fee || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-right text-slate-900 dark:text-white">₹{filteredFeeList.reduce((sum, f) => sum + (f.computer_fee || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-right text-slate-900 dark:text-white">₹{filteredFeeList.reduce((sum, f) => sum + (f.transport_fee || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-right text-slate-900 dark:text-white">₹{filteredFeeList.reduce((sum, f) => sum + (f.previous_due || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-right bg-blue-50 dark:bg-blue-900/20 text-[#137fec] dark:text-blue-400 font-bold">₹{filteredFeeList.reduce((sum, f) => sum + (f.total_fee || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-right text-green-600 dark:text-green-400 font-bold">₹{filteredFeeList.reduce((sum, f) => sum + (f.total_paid || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-right text-red-600 dark:text-red-400 font-bold">₹{filteredFeeList.reduce((sum, f) => sum + (f.net_payable || 0), 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-center text-slate-700 dark:text-slate-300">
                    <span className="text-xs">
                      {filteredFeeList.filter(f => f.bill_status === 'paid' || (f.net_payable || 0) === 0 || (f.net_payable || 0) < 0).length} Paid / {filteredFeeList.length} Total
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        </div>
      )}
    </div>
  )
}

export default FeeList

