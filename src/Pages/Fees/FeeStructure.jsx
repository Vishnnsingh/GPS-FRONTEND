import React, { useState, useEffect } from 'react'
import { createFeeStructure, getFeeStructures, updateFeeStructure, deleteFeeStructure } from '../../Api/fees'

const FEE_TYPES = [
  { name: 'Tuition Fee', defaultPeriod: 'monthly' },
  { name: 'Exam Fee', defaultPeriod: 'monthly' },
  { name: 'Annual Fee', defaultPeriod: 'yearly' },
  { name: 'Computer Fee', defaultPeriod: 'monthly' }
]

function FeeStructure() {
  const [feeStructures, setFeeStructures] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [mode, setMode] = useState('single') // 'single' or 'bulk'
  const [formData, setFormData] = useState({
    class: '',
    fee_name: '',
    fee_amount: '',
    period: 'monthly',
    late_fine_enabled: false,
    is_optional: false
  })
  const [bulkData, setBulkData] = useState([
    {
      class: '',
      fees: [
        { fee_name: 'Tuition Fee', fee_amount: '', period: 'monthly', late_fine_enabled: false, is_optional: false },
        { fee_name: 'Exam Fee', fee_amount: '', period: 'monthly', late_fine_enabled: false, is_optional: false },
        { fee_name: 'Annual Fee', fee_amount: '', period: 'yearly', late_fine_enabled: false, is_optional: false },
        { fee_name: 'Computer Fee', fee_amount: '', period: 'monthly', late_fine_enabled: false, is_optional: false }
      ]
    }
  ])

  useEffect(() => {
    fetchFeeStructures()
  }, [classFilter, sectionFilter])

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  const fetchFeeStructures = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getFeeStructures(classFilter, sectionFilter)
      // Handle different response structures
      if (response.success) {
        setFeeStructures(response.fee_structures || response.data || [])
      } else if (response.data && Array.isArray(response.data)) {
        // API returns { message, count, data: [...] }
        setFeeStructures(response.data)
      } else if (Array.isArray(response)) {
        // API returns array directly
        setFeeStructures(response)
      } else {
        setFeeStructures([])
        if (response.message) {
          // Show message but don't treat as error if data exists
          if (!response.data || response.data.length === 0) {
            setError(response.message)
          }
        }
      }
    } catch (err) {
      setError(err?.message || err?.data?.message || 'Failed to fetch fee structures')
      setFeeStructures([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'bulk' && !editingId) {
        // Bulk creation - flatten fees array
        const payload = []
        bulkData.forEach(item => {
          if (item.class) {
            item.fees.forEach(fee => {
              if (fee.fee_amount && fee.fee_amount > 0) {
                payload.push({
                  class: item.class,
                  fee_name: fee.fee_name,
                  fee_amount: parseFloat(fee.fee_amount),
                  period: fee.period,
                  late_fine_enabled: fee.late_fine_enabled,
                  is_optional: fee.is_optional
                })
              }
            })
          }
        })

        if (payload.length === 0) {
          setError('Please add at least one fee amount for the selected class')
          setLoading(false)
          return
        }

        const response = await createFeeStructure(payload)
        if (response.success || response.message) {
          setSuccess(`Successfully created ${payload.length} fee structure(s)!`)
          setIsModalOpen(false)
          resetForm()
          await fetchFeeStructures()
        } else {
          setError(response.message || 'Failed to create fee structures')
        }
      } else {
        // Single creation/update
        const payload = {
          class: formData.class,
          fee_name: formData.fee_name,
          fee_amount: parseFloat(formData.fee_amount),
          period: formData.period,
          late_fine_enabled: formData.late_fine_enabled,
          is_optional: formData.is_optional
        }

        let response
        if (editingId) {
          response = await updateFeeStructure(editingId, payload)
        } else {
          response = await createFeeStructure(payload)
        }

        if (response.success || response.message) {
          setSuccess(editingId ? 'Fee structure updated successfully' : 'Fee structure created successfully')
          setIsModalOpen(false)
          resetForm()
          await fetchFeeStructures()
        } else {
          setError(response.message || 'Failed to save fee structure')
        }
      }
    } catch (err) {
      setError(err?.message || err?.data?.message || 'Failed to save fee structure')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (fee) => {
    setEditingId(fee.id)
    setMode('single')
    setFormData({
      class: fee.class || '',
      fee_name: fee.fee_name || '',
      fee_amount: fee.fee_amount || '',
      period: fee.period || 'monthly',
      late_fine_enabled: fee.late_fine_enabled || false,
      is_optional: fee.is_optional || false
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee structure?')) {
      return
    }

    setError('')
    setSuccess('')
    setDeletingId(id)

    try {
      const response = await deleteFeeStructure(id)
      // Handle different response structures
      if (response.success || response.message) {
        setSuccess('Fee structure deleted successfully')
        // Optimistically remove from UI immediately
        setFeeStructures(prev => prev.filter(fee => fee.id !== id))
        // Also refresh to ensure sync
        await fetchFeeStructures()
      } else {
        setError(response.message || 'Failed to delete fee structure')
        // Refresh to get correct state
        await fetchFeeStructures()
      }
    } catch (err) {
      setError(err?.message || err?.data?.message || 'Failed to delete fee structure')
      // Refresh to get correct state in case of error
      await fetchFeeStructures()
    } finally {
      setDeletingId(null)
    }
  }

  const resetForm = () => {
    setFormData({
      class: '',
      fee_name: '',
      fee_amount: '',
      period: 'monthly',
      late_fine_enabled: false,
      is_optional: false
    })
    setBulkData([{
      class: '',
      fees: FEE_TYPES.map(fee => ({
        fee_name: fee.name,
        fee_amount: '',
        period: fee.defaultPeriod,
        late_fine_enabled: false,
        is_optional: false
      }))
    }])
    setEditingId(null)
    setMode('single')
  }

  const addBulkRow = () => {
    setBulkData([...bulkData, {
      class: bulkData[0]?.class || '',
      fees: FEE_TYPES.map(fee => ({
        fee_name: fee.name,
        fee_amount: '',
        period: fee.defaultPeriod,
        late_fine_enabled: false,
        is_optional: false
      }))
    }])
  }

  const removeBulkRow = (index) => {
    if (bulkData.length > 1) {
      setBulkData(bulkData.filter((_, i) => i !== index))
    }
  }

  const updateBulkFee = (rowIndex, feeIndex, field, value) => {
    const updated = [...bulkData]
    updated[rowIndex].fees[feeIndex] = { ...updated[rowIndex].fees[feeIndex], [field]: value }
    setBulkData(updated)
  }

  const updateBulkClassForAll = (value) => {
    setBulkData(bulkData.map(item => ({ ...item, class: value })))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fee Structure Management</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              resetForm()
              setMode('single')
              setIsModalOpen(true)
            }}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-500/90 transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base shadow-lg shadow-cyan-500/20"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Single
          </button>
          <button
            onClick={() => {
              resetForm()
              setMode('bulk')
              setIsModalOpen(true)
            }}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-500/90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 whitespace-nowrap text-sm sm:text-base"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            Add Bulk
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
        <div className="w-full sm:flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class</label>
          <input
            type="text"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            placeholder="Filter by class"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
        <button
          onClick={() => {
            setClassFilter('')
            setSectionFilter('')
          }}
          className="w-full sm:w-auto px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          Reset
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
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

      {/* Summary Stats */}
      {feeStructures.length > 0 && !loading && (() => {
        const totalClasses = new Set(feeStructures.map(f => f.class)).size
        const totalFees = feeStructures.length
        const totalAmount = feeStructures.reduce((sum, f) => sum + (f.fee_amount || 0), 0)
        const requiredCount = feeStructures.filter(f => !f.is_optional).length
        const optionalCount = feeStructures.filter(f => f.is_optional).length

        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-cyan-50/30 to-cyan-100/30 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-xl p-4 border border-cyan-200/30 dark:border-cyan-700/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-200 font-medium">Total Classes</p>
                  <p className="text-2xl font-black mt-1 text-cyan-200">{totalClasses}</p>
                </div>
                <span className="material-symbols-outlined text-3xl text-cyan-200">class</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50/30 to-cyan-100/30 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-xl p-4 border border-cyan-200/30 dark:border-cyan-700/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-200 font-medium">Total Fees</p>
                  <p className="text-2xl font-black mt-1 text-cyan-200">{totalFees}</p>
                </div>
                <span className="material-symbols-outlined text-3xl text-cyan-200">receipt_long</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50/30 to-cyan-100/30 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-xl p-4 border border-cyan-200/30 dark:border-cyan-700/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-200 font-medium">Total Amount</p>
                  <p className="text-xl font-black mt-1 text-cyan-200">₹{totalAmount.toLocaleString('en-IN')}</p>
                </div>
                <span className="material-symbols-outlined text-3xl text-cyan-200">payments</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50/30 to-cyan-100/30 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-xl p-4 border border-cyan-200/30 dark:border-cyan-700/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-cyan-200 font-medium">Required / Optional</p>
                  <p className="text-xl font-black mt-1 text-cyan-200">{requiredCount} / {optionalCount}</p>
                </div>
                <span className="material-symbols-outlined text-3xl text-cyan-200">check_circle</span>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Grouped by Class */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <span className="material-symbols-outlined animate-spin text-3xl text-cyan-200">sync</span>
        </div>
      ) : feeStructures.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">No fee structures found</p>
      ) : (() => {
        // Group fees by class
        const groupedByClass = feeStructures.reduce((acc, fee) => {
          const classKey = fee.class || 'Unknown'
          if (!acc[classKey]) {
            acc[classKey] = []
          }
          acc[classKey].push(fee)
          return acc
        }, {})

        // Calculate totals for each class
        const classTotals = Object.keys(groupedByClass).reduce((acc, classKey) => {
          acc[classKey] = groupedByClass[classKey].reduce((sum, fee) => sum + (fee.fee_amount || 0), 0)
          return acc
        }, {})

        return (
          <div className="space-y-6">
            {Object.keys(groupedByClass).sort().map((classKey) => {
              const classFees = groupedByClass[classKey]
              const totalAmount = classTotals[classKey]
              const requiredFees = classFees.filter(f => !f.is_optional)
              const optionalFees = classFees.filter(f => f.is_optional)

              return (
                <div 
                  key={classKey} 
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Class Header */}
                  <div className="bg-gradient-to-r from-cyan-50/30 to-cyan-500/10 dark:from-cyan-900/30 dark:to-cyan-800/20 px-4 sm:px-6 py-4 border-b border-cyan-200/30 dark:border-cyan-700/50">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex items-start sm:items-center gap-3 sm:gap-4">
                        <div className="bg-cyan-300/15 dark:bg-cyan-500/20 rounded-xl p-2 sm:p-2.5 shrink-0">
                          <span className="material-symbols-outlined text-cyan-200 dark:text-cyan-200 text-xl sm:text-2xl">class</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                            Class {classKey}
                          </h4>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                            <span className="inline-flex items-center rounded-full bg-cyan-500/20 dark:bg-cyan-500/30 border border-cyan-400/50 dark:border-cyan-400/50 px-2 py-0.5 text-white dark:text-white font-medium">
                              {classFees.length} {classFees.length === 1 ? 'Fee Structure' : 'Fee Structures'}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-cyan-500/20 dark:bg-cyan-500/30 border border-cyan-400/50 dark:border-cyan-400/50 px-2 py-0.5 text-white dark:text-white font-medium">
                              Required {requiredFees.length}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-cyan-500/20 dark:bg-cyan-500/30 border border-cyan-400/50 dark:border-cyan-400/50 px-2 py-0.5 text-white dark:text-white font-medium">
                              Optional {optionalFees.length}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full sm:w-auto sm:min-w-[160px] rounded-xl border border-cyan-400/50 dark:border-cyan-400/50 bg-cyan-500/20 dark:bg-cyan-500/30 px-3 py-2.5 text-left sm:text-right">
                        <p className="text-[11px] text-white dark:text-white uppercase tracking-wide font-semibold">Total Amount</p>
                        <p className="text-2xl sm:text-3xl font-black text-white dark:text-white leading-tight">
                          Rs. {totalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fees Table */}
                  <div className="overflow-x-auto table-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(99, 126, 153) rgb(224, 242, 254)' }}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-cyan-500 dark:bg-cyan-500 border-b border-cyan-200/30 dark:border-cyan-700/50">
                          <th className="px-4 py-3 text-left font-semibold text-white">Fee Name</th>
                          <th className="px-4 py-3 text-right font-semibold text-white">Amount</th>
                          <th className="px-4 py-3 text-center font-semibold text-white">Period</th>
                          <th className="px-4 py-3 text-center font-semibold text-white">Late Fine</th>
                          <th className="px-4 py-3 text-center font-semibold text-white">Type</th>
                          <th className="px-4 py-3 text-center font-semibold text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {classFees.map((fee, index) => (
                          <tr 
                            key={fee.id} 
                            className={`border-b border-cyan-200/30 dark:border-cyan-700/50 hover:bg-cyan-50/30 dark:hover:bg-cyan-900/10 transition-colors ${
                              index === classFees.length - 1 ? 'border-b-0' : ''
                            }`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900 dark:text-white">{fee.fee_name}</span>
                                {fee.is_optional && (
                                  <span className="px-1.5 py-0.5 bg-cyan-300/15 dark:bg-cyan-500/20 text-cyan-200 dark:text-cyan-200 rounded text-xs font-medium border border-cyan-400/30 dark:border-cyan-600/50">
                                    Optional
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-bold text-slate-900 dark:text-white text-base">
                                ₹{fee.fee_amount?.toLocaleString('en-IN') || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                fee.period === 'yearly' 
                                  ? 'bg-cyan-300/15 dark:bg-cyan-500/20 text-cyan-200 dark:text-cyan-200 border border-cyan-400/30 dark:border-cyan-600/50' 
                                  : 'bg-cyan-300/15 dark:bg-cyan-500/20 text-cyan-200 dark:text-cyan-200 border border-cyan-400/30 dark:border-cyan-600/50'
                              }`}>
                                {fee.period === 'yearly' ? '📅 Yearly' : '📆 Monthly'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {fee.late_fine_enabled ? (
                                <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium flex items-center justify-center gap-1 w-fit mx-auto border border-amber-200 dark:border-amber-700/50">
                                  <span className="material-symbols-outlined text-xs">warning</span>
                                  Enabled
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700/50">
                                  Disabled
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {fee.is_optional ? (
                                <span className="px-3 py-1 bg-cyan-300/15 dark:bg-cyan-500/20 text-cyan-200 dark:text-cyan-200 rounded-full text-xs font-medium border border-cyan-400/30 dark:border-cyan-600/50">
                                  Optional
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-cyan-300/15 dark:bg-cyan-500/20 text-cyan-200 dark:text-cyan-200 rounded-full text-xs font-medium border border-cyan-400/30 dark:border-cyan-600/50">
                                  Required
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEdit(fee)}
                                  disabled={deletingId === fee.id || deletingId !== null}
                                  className="p-2 text-cyan-200 hover:bg-cyan-100/30 dark:hover:bg-cyan-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Edit fee structure"
                                >
                                  <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button
                                  onClick={() => handleDelete(fee.id)}
                                  disabled={deletingId === fee.id || deletingId !== null}
                                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Delete fee structure"
                                >
                                  {deletingId === fee.id ? (
                                    <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                                  ) : (
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      {/* Class Summary Footer */}
                      <tfoot>
                        <tr className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                          <td colSpan={2} className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                            Class Total:
                          </td>
                          <td colSpan={4} className="px-4 py-3 text-right">
                            <span className="text-xl font-bold text-cyan-200 dark:text-cyan-200">
                              ₹{totalAmount.toLocaleString('en-IN')}
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })()}

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center p-4 pt-20 lg:pl-72"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) {
              setIsModalOpen(false)
              resetForm()
            }
          }}
        >
          <div 
            className={`bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full relative z-[9999] flex flex-col ${
              mode === 'bulk' ? 'max-w-5xl' : 'max-w-2xl'
            } max-h-[calc(90vh-5rem)]`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 rounded-t-xl z-10">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {editingId ? 'Edit Fee Structure' : mode === 'bulk' ? 'Add Bulk Fee Structures' : 'Add Fee Structure'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  resetForm()
                }}
                className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 pt-4 table-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(99, 126, 153) rgb(224, 242, 254)' }}>

            {!editingId && (
              <div className="mb-6 flex gap-3 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setMode('single')}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    mode === 'single'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Single Entry
                </button>
                <button
                  type="button"
                  onClick={() => setMode('bulk')}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    mode === 'bulk'
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Bulk Entry
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'bulk' && !editingId ? (
                <>
                  {/* Bulk Mode */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class (for all) *</label>
                    <input
                      type="text"
                      required
                      value={bulkData[0]?.class || ''}
                      onChange={(e) => updateBulkClassForAll(e.target.value)}
                      placeholder="e.g., LKG, 1, 2"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This class will be applied to all fee structures below</p>
                  </div>

                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 table-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(99, 126, 153) rgb(224, 242, 254)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Classes & Fees:</p>
                      <button
                        type="button"
                        onClick={addBulkRow}
                        className="px-4 py-2 text-sm bg-cyan-500 text-white rounded-lg hover:bg-cyan-500/90 transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                      >
                        <span className="material-symbols-outlined text-base">add</span>
                        Add Another Class
                      </button>
                    </div>

                    <div className="space-y-4">
                      {bulkData.map((item, rowIndex) => (
                        <div key={rowIndex} className="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900/50 hover:border-[#137fec] dark:hover:border-[#137fec] transition-all shadow-sm">
                          <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                              <span className="text-base font-black text-slate-900 dark:text-white">Class: {item.class || 'Not Set'}</span>
                            </div>
                            {bulkData.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBulkRow(rowIndex)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Remove this class"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            )}
                          </div>

                          {/* All fees in one table/card */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                                  <th className="px-3 py-2 text-left font-bold text-slate-900 dark:text-white">Fee Name</th>
                                  <th className="px-3 py-2 text-right font-bold text-slate-900 dark:text-white">Amount</th>
                                  <th className="px-3 py-2 text-center font-bold text-slate-900 dark:text-white">Period</th>
                                  <th className="px-3 py-2 text-center font-bold text-slate-900 dark:text-white">Late Fine</th>
                                  <th className="px-3 py-2 text-center font-bold text-slate-900 dark:text-white">Optional</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.fees.map((fee, feeIndex) => (
                                  <tr key={feeIndex} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/30">
                                    <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">
                                      {fee.fee_name}
                                    </td>
                                    <td className="px-3 py-3">
                                      <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={fee.fee_amount}
                                        onChange={(e) => updateBulkFee(rowIndex, feeIndex, 'fee_amount', e.target.value)}
                                        placeholder="0.00"
                                        className="w-full px-2 py-1.5 text-sm border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-right"
                                      />
                                    </td>
                                    <td className="px-3 py-3">
                                      <select
                                        value={fee.period}
                                        onChange={(e) => updateBulkFee(rowIndex, feeIndex, 'period', e.target.value)}
                                        className="w-full px-2 py-1.5 text-sm border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
                                      >
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                      </select>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                      <label className="flex items-center justify-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={fee.late_fine_enabled}
                                          onChange={(e) => updateBulkFee(rowIndex, feeIndex, 'late_fine_enabled', e.target.checked)}
                                          className="w-5 h-5 text-cyan-500 rounded focus:ring-2 focus:ring-cyan-400"
                                        />
                                      </label>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                      <label className="flex items-center justify-center cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={fee.is_optional}
                                          onChange={(e) => updateBulkFee(rowIndex, feeIndex, 'is_optional', e.target.checked)}
                                          className="w-5 h-5 text-cyan-500 rounded focus:ring-2 focus:ring-cyan-400"
                                        />
                                      </label>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Single Mode */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Class *</label>
                      <input
                        type="text"
                        required
                        value={formData.class}
                        onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                        placeholder="e.g., LKG, 1, 2"
                        className="w-full px-4 py-2.5 border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Fee Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.fee_name}
                        onChange={(e) => setFormData({ ...formData, fee_name: e.target.value })}
                        placeholder="e.g., Tuition Fee"
                        className="w-full px-4 py-2.5 border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Fee Amount *</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        min="0"
                        value={formData.fee_amount}
                        onChange={(e) => setFormData({ ...formData, fee_amount: e.target.value })}
                        placeholder="0.00"
                        className="w-full px-4 py-2.5 border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Period *</label>
                      <select
                        required
                        value={formData.period}
                        onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                        className="w-full px-4 py-2.5 border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <input
                        type="checkbox"
                        id="late_fine_enabled"
                        checked={formData.late_fine_enabled}
                        onChange={(e) => setFormData({ ...formData, late_fine_enabled: e.target.checked })}
                        className="w-5 h-5 text-[#137fec] rounded focus:ring-2 focus:ring-[#137fec]"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable Late Fine</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <input
                        type="checkbox"
                        id="is_optional"
                        checked={formData.is_optional}
                        onChange={(e) => setFormData({ ...formData, is_optional: e.target.checked })}
                        className="w-5 h-5 text-[#137fec] rounded focus:ring-2 focus:ring-[#137fec]"
                      />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Optional Fee</span>
                    </label>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-500/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                      {editingId ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingId ? 'Update' : 'Create'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeeStructure
