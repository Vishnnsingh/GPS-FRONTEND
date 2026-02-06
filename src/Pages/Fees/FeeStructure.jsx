import React, { useState, useEffect } from 'react'
import { createFeeStructure, getFeeStructures, updateFeeStructure, deleteFeeStructure } from '../../Api/fees'

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
  const [formData, setFormData] = useState({
    class: '',
    section: '',
    fee_name: '',
    fee_amount: '',
    is_optional: false
  })

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
      const payload = {
        class: formData.class,
        section: formData.section,
        fee_name: formData.fee_name,
        fee_amount: parseFloat(formData.fee_amount),
        is_optional: formData.is_optional
      }

      let response
      if (editingId) {
        response = await updateFeeStructure(editingId, payload)
      } else {
        response = await createFeeStructure(payload)
      }

      // Handle different response structures
      if (response.success || response.message) {
        setSuccess(editingId ? 'Fee structure updated successfully' : 'Fee structure created successfully')
        // Close modal and reset form immediately
        setIsModalOpen(false)
        resetForm()
        // Refresh the list
        await fetchFeeStructures()
      } else {
        setError(response.message || 'Failed to save fee structure')
      }
    } catch (err) {
      setError(err?.message || err?.data?.message || 'Failed to save fee structure')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (fee) => {
    setEditingId(fee.id)
    setFormData({
      class: fee.class || '',
      section: fee.section || '',
      fee_name: fee.fee_name || '',
      fee_amount: fee.fee_amount || '',
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
      section: '',
      fee_name: '',
      fee_amount: '',
      is_optional: false
    })
    setEditingId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fee Structure Management</h3>
        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="px-4 py-2 bg-[#137fec] text-white rounded-lg hover:bg-[#137fec]/90 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Fee Structure
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class</label>
          <input
            type="text"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            placeholder="Filter by class"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section</label>
          <input
            type="text"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            placeholder="Filter by section"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
        </div>
        <button
          onClick={() => {
            setClassFilter('')
            setSectionFilter('')
          }}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
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

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <span className="material-symbols-outlined animate-spin text-3xl text-[#137fec]">sync</span>
        </div>
      ) : feeStructures.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">No fee structures found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left font-bold text-slate-900 dark:text-white">Class</th>
                <th className="px-4 py-3 text-left font-bold text-slate-900 dark:text-white">Section</th>
                <th className="px-4 py-3 text-left font-bold text-slate-900 dark:text-white">Fee Name</th>
                <th className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">Amount</th>
                <th className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">Optional</th>
                <th className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeStructures.map((fee) => (
                <tr key={fee.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-4 py-3 text-slate-900 dark:text-white">{fee.class}</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-white">{fee.section || '--'}</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">{fee.fee_name}</td>
                  <td className="px-4 py-3 text-right text-slate-900 dark:text-white">₹{fee.fee_amount}</td>
                  <td className="px-4 py-3 text-center">
                    {fee.is_optional ? (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs">Optional</span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs">Required</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(fee)}
                        disabled={deletingId === fee.id}
                        className="p-1.5 text-[#137fec] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(fee.id)}
                        disabled={deletingId === fee.id || deletingId !== null}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === fee.id ? (
                          <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                        ) : (
                          <span className="material-symbols-outlined text-sm">delete</span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingId ? 'Edit Fee Structure' : 'Add Fee Structure'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  resetForm()
                }}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Class *</label>
                <input
                  type="text"
                  required
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section *</label>
                <input
                  type="text"
                  required
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fee Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fee_name}
                  onChange={(e) => setFormData({ ...formData, fee_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fee Amount *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.fee_amount}
                  onChange={(e) => setFormData({ ...formData, fee_amount: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_optional"
                  checked={formData.is_optional}
                  onChange={(e) => setFormData({ ...formData, is_optional: e.target.checked })}
                  className="w-4 h-4 text-[#137fec] rounded"
                />
                <label htmlFor="is_optional" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Optional Fee
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#137fec] text-white rounded-lg hover:bg-[#137fec]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
      )}
    </div>
  )
}

export default FeeStructure

