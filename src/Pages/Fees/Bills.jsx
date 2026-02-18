import React, { useState } from 'react';
import { generateBillsForClass, downloadBillsData, closeMonth } from '../../Api/fees';
import { Tabs, Tab } from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Ensure autoTable is properly registered
jsPDF.API.autoTable = autoTable;

function Bills() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [billsData, setBillsData] = useState(null);
  const [formData, setFormData] = useState({
    class: '',
    month: ''
  });
  const [feeOptions, setFeeOptions] = useState({
    include_exam_fee: true,
    include_annual_fee: true,
    include_computer_fee: true
  });
  const [actionType, setActionType] = useState('generate'); // generate, downloadData
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
  };

  const handleGenerateBills = async () => {
    if (!formData.class || !formData.month) {
      setError('Please enter class and month');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    setBillsData(null);

    try {
      const response = await generateBillsForClass(formData.class, formData.month, {
        include_exam_fee: feeOptions.include_exam_fee,
        include_annual_fee: feeOptions.include_annual_fee,
        include_computer_fee: feeOptions.include_computer_fee
      });

      if (response.bills && Array.isArray(response.bills)) {
        setSuccess(response.message || `Bills generated successfully for Class ${formData.class}! ${response.bills.length} bills created.`);
        setFormData({ class: '', month: '' });
        setFeeOptions({
          include_exam_fee: true,
          include_annual_fee: true,
          include_computer_fee: true
        });

        // Automatically generate and download the PDF
        generatePDF(response.bills);
      } else {
        setError(response.message || 'Failed to generate bills');
      }
    } catch (err) {
      setError(err?.message || 'Failed to generate bills');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBillsData = async () => {
    if (!formData.month) {
      setError('Please enter month');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);
    setBillsData(null);

    try {
      const response = await downloadBillsData(formData.month, formData.class || '');
      if (response && response.bills && Array.isArray(response.bills)) {
        setBillsData(response.bills);
        setSuccess(`Found ${response.totalBills} bill(s)`);
        generatePDF(response.bills);
      } else {
        setError(response.message || 'No bills found');
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch bills data');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseMonth = async () => {
    if (!formData.month) {
      setError('Please enter a month to close');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await closeMonth(formData.month);
      if (response.success) {
        setSuccess(response.message || `Month ${formData.month} closed successfully.`);
        setFormData({ ...formData, month: '' });
      } else {
        setError(response.message || 'Failed to close the month');
      }
    } catch (err) {
      setError(err?.message || 'Failed to close the month');
    } finally {
      setLoading(false);
    }
  };

  // Updated the generatePDF function to match the design of the provided bulk invoice
  const generatePDF = (bills) => {
    try {
      const doc = new jsPDF();

      bills.forEach((bill, index) => {
        if (index !== 0) {
          doc.addPage();
        }

        // Add school header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('GYANODAY PUBLIC SCHOOL', 10, 10);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Blaspur Dainmanwa Road, Harinagar (W. Champaran)', 10, 16);

        // Add invoice details
        doc.setFontSize(10);
        doc.text(`Invoice: ${bill.bill_id || '--'}`, 150, 10, { align: 'right' });
        doc.text(`Date: ${bill.date || '--'}`, 150, 16, { align: 'right' });

        // Add student details
        doc.setFontSize(10);
        doc.text(`Student's Name: ${bill.student?.name || '--'}`, 10, 30);
        doc.text(`Class: ${bill.student?.class || '--'}`, 10, 40);
        doc.text(`Section: ${bill.student?.section || '--'}`, 10, 50);
        doc.text(`Month: ${bill.month || '--'}`, 10, 60);

        // Add fee details table
        const items = [
          ['School Fee', bill.items.find((item) => item.fee_name === 'School Fee')?.amount || '--'],
          ['Examination Fee', bill.items.find((item) => item.fee_name === 'Examination Fee')?.amount || '--'],
          ['Annual Charges', bill.items.find((item) => item.fee_name === 'Annual Charges')?.amount || '--'],
          ['Transport Fee', bill.items.find((item) => item.fee_name === 'Transport Fee')?.amount || '--'],
          ['Hostel Fee', bill.items.find((item) => item.fee_name === 'Hostel Fee')?.amount || '--'],
          ['Computer Fee', bill.items.find((item) => item.fee_name === 'Computer Fee')?.amount || '--'],
          ['Fine Fee', bill.items.find((item) => item.fee_name === 'Fine Fee')?.amount || '--'],
          ['Total', bill.total || '--'],
          ['Paid', bill.paid || '--'],
          ['Balance', bill.net_payable || '--'],
        ];

        doc.autoTable({
          startY: 70,
          head: [['Details', 'Amount (Rs)']],
          body: items,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2 },
          columnStyles: {
            0: { cellWidth: 120 },
            1: { cellWidth: 60 },
          },
        });

        // Add signature line
        const finalY = doc.lastAutoTable.finalY + 20;
        doc.text('Signature of Receiver: ______________________', 10, finalY);
      });

      doc.save('bills.pdf');
    } catch (error) {
      console.error('Error in generatePDF:', error);
      setError('Error generating PDF: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (actionType === 'generate') {
      await handleGenerateBills();
    } else if (actionType === 'downloadData') {
      await handleDownloadBillsData();
    }
  };

  // Added a new function to download all bills in a single PDF
  const downloadAllBillsPDF = async () => {
    if (!formData.month) {
      setError('Please enter a month to download all bills');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await downloadBillsData(formData.month, formData.class || '');
      if (response && response.bills && Array.isArray(response.bills)) {
        const doc = new jsPDF();
        response.bills.forEach((bill, index) => {
          if (index !== 0) doc.addPage();

          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text('GYANODAY PUBLIC SCHOOL', 10, 10);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text('Blaspur Dainmanwa Road, Harinagar (W. Champaran)', 10, 16);

          doc.text(`Sl. No: ${bill.bill_id || '--'}`, 10, 26);
          doc.text(`Student's Name: ${bill.student?.name || '--'}`, 10, 32);
          doc.text(`Father's Name: ${bill.student?.father_name || '--'}`, 10, 38);
          doc.text(`Class: ${bill.student?.class || '--'}`, 10, 44);
          doc.text(`Sec: ${bill.student?.section || '--'}`, 10, 50);
          doc.text(`Month: ${bill.month || '--'}`, 10, 56);

          const items = bill.items.map((item) => [item.fee_name, item.amount]);
          items.push(['Advance', bill.advance || '--']);
          items.push(['Previous Due', bill.previous_due || '--']);
          items.push(['Total', bill.total || '--']);
          items.push(['Net Payable', bill.net_payable || '--']);

          doc.autoTable({
            startY: 60,
            head: [['Details', 'Amount (Rs)']],
            body: items,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2 },
          });

          doc.text('Signature of Receiver: ______________________', 10, doc.internal.pageSize.getHeight() - 20);
        });

        doc.save('all_bills.pdf');
        setSuccess('All bills downloaded successfully');
      } else {
        setError(response.message || 'No bills found to download');
      }
    } catch (err) {
      setError(err?.message || 'Failed to download all bills');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
        <Tab label="Bills Management" />
        <Tab label="Close Month" />
      </Tabs>

      {activeTab === 0 && (
        <div>
          {/* Existing Bills Management UI */}
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bills Management</h3>

          {/* Action Type Selection */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Select Action:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActionType('generate')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  actionType === 'generate'
                    ? 'bg-[#137fec] text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-sm">receipt_long</span>
                Generate Bills
              </button>
              <button
                onClick={() => setActionType('downloadData')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  actionType === 'downloadData'
                    ? 'bg-[#137fec] text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-sm">download</span>
                View Bills Data
              </button>
              <button
                onClick={handleDownloadBillsData}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 bg-green-500 text-white hover:bg-green-600"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Download Bills
              </button>
              <button
                onClick={downloadAllBillsPDF}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 bg-purple-500 text-white hover:bg-purple-600"
              >
                <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                Download All Bills (Single PDF)
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center justify-between">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center justify-between">
              <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
              <button
                onClick={() => setSuccess('')}
                className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Class {actionType === 'generate' ? '*' : '(Optional)'}
              </label>
              <input
                type="text"
                required={actionType === 'generate'}
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                placeholder="e.g., 1, 2, 3, LKG"
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Month *</label>
              <input
                type="month"
                required
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Format: YYYY-MM (e.g., 2024-01)</p>
            </div>

            {/* Fee Options for Generate Bills */}
            {actionType === 'generate' && (
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Include Fee Types:</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={feeOptions.include_exam_fee}
                      onChange={(e) => setFeeOptions({ ...feeOptions, include_exam_fee: e.target.checked })}
                      className="w-5 h-5 text-[#137fec] rounded focus:ring-2 focus:ring-[#137fec]"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Include Exam Fee</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={feeOptions.include_annual_fee}
                      onChange={(e) => setFeeOptions({ ...feeOptions, include_annual_fee: e.target.checked })}
                      className="w-5 h-5 text-[#137fec] rounded focus:ring-2 focus:ring-[#137fec]"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Include Annual Fee</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={feeOptions.include_computer_fee}
                      onChange={(e) => setFeeOptions({ ...feeOptions, include_computer_fee: e.target.checked })}
                      className="w-5 h-5 text-[#137fec] rounded focus:ring-2 focus:ring-[#137fec]"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Include Computer Fee</span>
                  </label>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Note: Tuition Fee is always included</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#137fec] text-white rounded-lg hover:bg-[#137fec]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">
                      {actionType === 'generate' ? 'receipt_long' : 'download'}
                    </span>
                    {actionType === 'generate' && 'Generate Bills'}
                    {actionType === 'downloadData' && 'View Bills Data'}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bills Data Display */}
          {billsData && billsData.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mt-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
                <h4 className="text-md font-bold text-slate-900 dark:text-white">
                  Bills Data ({billsData.length} {billsData.length === 1 ? 'bill' : 'bills'})
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-300 dark:border-slate-600">
                      <th className="px-4 py-3 text-left font-bold text-slate-900 dark:text-white">Student</th>
                      <th className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">Class</th>
                      <th className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">Roll</th>
                      <th className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">Month</th>
                      <th className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">Transport</th>
                      <th className="px-3 py-3 text-left font-bold text-slate-900 dark:text-white">Fee Items</th>
                      <th className="px-3 py-3 text-center font-bold text-slate-900 dark:text-white">Bill ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billsData.map((bill, index) => (
                      <tr key={bill.bill_id || index} className="border-b border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {bill.student?.name || '--'}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center text-slate-900 dark:text-white font-medium">
                          {bill.student?.class || '--'}
                        </td>
                        <td className="px-3 py-3 text-center text-slate-900 dark:text-white">
                          {bill.student?.roll_no || '--'}
                        </td>
                        <td className="px-3 py-3 text-center text-slate-900 dark:text-white">
                          {bill.month || '--'}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {bill.student?.uses_transport ? (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold">
                              Yes (₹{bill.student?.transport_charge || 0})
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 rounded-full text-xs font-semibold">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          {bill.items && bill.items.length > 0 ? (
                            <div className="space-y-1">
                              {bill.items.map((item, idx) => (
                                <div key={idx} className="text-xs text-slate-700 dark:text-slate-300">
                                  {item.fee_name}: <span className="font-medium">₹{item.amount || 0}</span>
                                </div>
                              ))}
                              <div className="text-xs font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700 mt-1">
                                Total: ₹{bill.items.reduce((sum, item) => sum + (item.amount || 0), 0)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-500 dark:text-slate-400">No items</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="text-xs text-slate-600 dark:text-slate-400 break-all">
                            {bill.bill_id || '--'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {billsData && billsData.length === 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
              <p className="text-slate-500 dark:text-slate-400">No bills found for the selected filters</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 1 && (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Close Month</h3>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Select a month to close:</p>
          <div className="flex gap-3">
            <input
              type="month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              placeholder="Select Month"
              className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            />
            <button
              onClick={handleCloseMonth}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  Closing...
                </>
              ) : (
                'Close Month'
              )}
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center justify-between">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 flex items-center justify-between">
              <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
              <button
                onClick={() => setSuccess('')}
                className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Bills
