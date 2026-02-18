import React, { useState, useEffect } from 'react'
import { createFeeStructure, getFeeStructures, updateFeeStructure, deleteFeeStructure } from '../../Api/fees'

function FeeStructure() {
  const [feeStructures, setFeeStructures] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  
  const classes = ['Mother Care', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8']
  const feeTypes = [
    { key: 'tuition_fee', label: 'Tuition Fee' },
    { key: 'exam_fee', label: 'Exam Fee' },
    { key: 'annual_fee', label: 'Annual Fee' },
    { key: 'computer_fee', label: 'Computer Fee' }
  ]

  const [formData, setFormData] = useState({
    class: '',
    tuition_fee: '',
    exam_fee: '',
    annual_fee: '',
    computer_fee: ''
  })

  useEffect(() => {
    fetchFeeStructures()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classFilter])

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
      const response = await getFeeStructures(classFilter)
      if (response.success) {
        setFeeStructures(response.fee_structures || response.data || [])
      } else if (response.data && Array.isArray(response.data)) {
        setFeeStructures(response.data)
      } else if (Array.isArray(response)) {
        setFeeStructures(response)
      } else {
        setFeeStructures([])
        if (response.message) {
          if (!response.data || response.data.length === 0) {
            setError(response.message)
          }
        }
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch fee structures')
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
      const payload = {
        class: formData.class,
        tuition_fee: parseFloat(formData.tuition_fee) || 0,
        exam_fee: parseFloat(formData.exam_fee) || 0,
        annual_fee: parseFloat(formData.annual_fee) || 0,
        computer_fee: parseFloat(formData.computer_fee) || 0
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
    } catch (err) {
      setError(err?.message || 'Failed to save fee structure')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (fee) => {
    setEditingId(fee.id)
    setFormData({
      class: fee.class || '',
      tuition_fee: fee.tuition_fee || '',
      exam_fee: fee.exam_fee || '',
      annual_fee: fee.annual_fee || '',
      computer_fee: fee.computer_fee || ''
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
      if (response.success || response.message) {
        setSuccess('Fee structure deleted successfully')
        setFeeStructures(prev => prev.filter(fee => fee.id !== id))
        await fetchFeeStructures()
      } else {
        setError(response.message || 'Failed to delete fee structure')
        await fetchFeeStructures()
      }
    } catch (err) {
      setError(err?.message || 'Failed to delete fee structure')
      await fetchFeeStructures()
    } finally {
      setDeletingId(null)
    }
  }

  const resetForm = () => {
    setFormData({
      class: '',
      tuition_fee: '',
      exam_fee: '',
      annual_fee: '',
      computer_fee: ''
    })
    setEditingId(null)
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Fee Structure Management</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">settings</span>
            Manage fee structure for each class
          </p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="px-6 py-3 bg-linear-to-r from-[#137fec] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2 font-semibold whitespace-nowrap"
        >
          <span className="material-symbols-outlined">add</span>
          Add Fee Structure
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <label className="flex text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 items-center gap-2">
          <span className="material-symbols-outlined">filter_list</span>
          Filter by Class
        </label>
        <div className="flex gap-3">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
          >
            <option value="">-- All Classes --</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
          <button
            onClick={() => setClassFilter('')}
            className="px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold transition-colors duration-300"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-red-700 dark:text-red-300">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">{success}</p>
          </div>
          <button onClick={() => setSuccess('')} className="text-green-700 dark:text-green-300">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined animate-spin text-4xl text-[#137fec]">sync</span>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Loading fee structures...</p>
          </div>
        </div>
      ) : feeStructures.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 border border-slate-200 dark:border-slate-700 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-600 mx-auto mb-4 flex justify-center">receipt_long</span>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">No fee structures found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-900 dark:text-white">Class</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">Tuition Fee</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">Exam Fee</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">Annual Fee</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">Computer Fee</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">Total</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {feeStructures.map((fee) => {
                  const total = (parseFloat(fee.tuition_fee) || 0) + (parseFloat(fee.exam_fee) || 0) + (parseFloat(fee.annual_fee) || 0) + (parseFloat(fee.computer_fee) || 0)
                  return (
                    <tr key={fee.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#137fec]/10 text-[#137fec] dark:text-blue-400 rounded-lg font-bold text-sm">
                          <span className="material-symbols-outlined text-base">class</span>
                          {fee.class}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-900 dark:text-white font-semibold">₹{fee.tuition_fee || 0}</td>
                      <td className="px-6 py-4 text-right text-slate-900 dark:text-white font-semibold">₹{fee.exam_fee || 0}</td>
                      <td className="px-6 py-4 text-right text-slate-900 dark:text-white font-semibold">₹{fee.annual_fee || 0}</td>
                      <td className="px-6 py-4 text-right text-slate-900 dark:text-white font-semibold">₹{fee.computer_fee || 0}</td>
                      <td className="px-6 py-4 text-right text-slate-900 dark:text-white font-bold text-lg">₹{total}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(fee)}
                            disabled={deletingId === fee.id}
                            className="p-2 text-[#137fec] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(fee.id)}
                            disabled={deletingId === fee.id || deletingId !== null}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            {deletingId === fee.id ? (
                              <span className="material-symbols-outlined animate-spin">sync</span>
                            ) : (
                              <span className="material-symbols-outlined">delete</span>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && !loading) {
              setIsModalOpen(false)
              resetForm()
            }
          }}
        >
          <div 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#137fec]">settings</span>
                  {editingId ? 'Edit Fee Structure' : 'Add Fee Structure'}
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 items-center gap-2">
                  <span className="material-symbols-outlined text-base">class</span>
                  Class *
                </label>
                <select
                  required
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                >
                  <option value="">-- Select Class --</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feeTypes.map((fee) => (
                  <div key={fee.key}>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      {fee.label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-slate-600 dark:text-slate-400 font-semibold">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData[fee.key]}
                        onChange={(e) => setFormData({ ...formData, [fee.key]: e.target.value })}
                        className="w-full pl-8 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#137fec] focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Total Fee</p>
                <p className="text-3xl font-black text-[#137fec]">
                  ₹{((parseFloat(formData.tuition_fee) || 0) + (parseFloat(formData.exam_fee) || 0) + (parseFloat(formData.annual_fee) || 0) + (parseFloat(formData.computer_fee) || 0)).toFixed(2)}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-[#137fec] to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">sync</span>
                      {editingId ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">check</span>
                      {editingId ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    resetForm()
                  }}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeeStructure

