import React, { useState, useEffect } from 'react'
import { updateStudent } from '../../Api/students'

function EditStudent({ isOpen, onClose, onSuccess, studentData }) {
  const [formData, setFormData] = useState({
    name: '',
    father_name: '',
    mother_name: '',
    gender: 'Male',
    class: '',
    roll_no: '',
    section: '',
    mobile: '',
    address: '',
    uses_transport: false,
    transport_charge: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (studentData && isOpen) {
      // Pre-fill form with student data - check multiple possible field names
      setFormData({
        name: studentData.Name || studentData.name || '',
        father_name: studentData.Father || studentData.father_name || studentData.father || '',
        mother_name: studentData.Mother || studentData.mother_name || studentData.mother || studentData.MotherName || '',
        gender: studentData.Gender || studentData.gender || 'Male',
        class: studentData.Class || studentData.class || '',
        roll_no: studentData.Roll || studentData.roll_no || studentData.roll || '',
        section: studentData.Section || studentData.section || '',
        mobile: studentData.Mobile || studentData.mobile || '',
        address: studentData.Address || studentData.address || '',
        uses_transport: studentData.Transport && studentData.Transport !== "No" && typeof studentData.Transport === 'number',
        transport_charge: (studentData.Transport && typeof studentData.Transport === 'number') ? studentData.Transport : null
      })
      // Log student data for debugging
      console.log('Student data for edit:', studentData)
    }
  }, [studentData, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        roll_no: parseInt(formData.roll_no) || 0,
        transport_charge: formData.uses_transport ? (formData.transport_charge ? parseFloat(formData.transport_charge) : null) : null
      }
      
      // Get student ID from studentData - try multiple possible field names (API uses ID uppercase)
      const studentId = studentData?.ID || studentData?._id || studentData?.id || studentData?.Id || studentData?.student_id || studentData?.StudentId
      
      if (!studentId) {
        // If no ID found, log the student data for debugging
        console.error('Student data (no ID found):', studentData)
        throw new Error('Student ID not found. Please check if the student has a valid ID.')
      }
      
      const response = await updateStudent(studentId, submitData)
      
      if (response.success) {
        setSuccess(true)
        setError('')
        
        // Show success message for 2 seconds then close
        setTimeout(() => {
          setSuccess(false)
          onSuccess?.()
          onClose()
        }, 2000)
      }
    } catch (err) {
      setError(err?.message || 'Failed to update student')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-20" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Blurred Background */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[calc(90vh-5rem)] overflow-hidden z-[9999]">
        <style>{`
          .scrollbar-cyan::-webkit-scrollbar {
            width: 8px;
          }
          .scrollbar-cyan::-webkit-scrollbar-track {
            background: rgb(224, 242, 254);
            border-radius: 4px;
          }
          .scrollbar-cyan::-webkit-scrollbar-thumb {
            background: rgb(99, 126, 153);
            border-radius: 4px;
          }
          .scrollbar-cyan::-webkit-scrollbar-thumb:hover {
            background: rgb(71, 85, 105);
          }
          .dark .scrollbar-cyan::-webkit-scrollbar-track {
            background: rgb(224, 242, 254);
          }
          .dark .scrollbar-cyan::-webkit-scrollbar-thumb {
            background: rgb(99, 126, 153);
          }
          .dark .scrollbar-cyan::-webkit-scrollbar-thumb:hover {
            background: rgb(71, 85, 105);
          }
          @media (prefers-color-scheme: dark) {
            .scrollbar-cyan::-webkit-scrollbar-track {
              background: rgb(224, 242, 254);
            }
            .scrollbar-cyan::-webkit-scrollbar-thumb {
              background: rgb(99, 126, 153);
            }
            .scrollbar-cyan::-webkit-scrollbar-thumb:hover {
              background: rgb(71, 85, 105);
            }
          }
        `}</style>
        {/* Header */}
        <div className="bg-cyan-500 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-black">Edit Student</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-12rem)] scrollbar-cyan" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(99, 126, 153) rgb(224, 242, 254)'
        }}>
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Student updated successfully!</p>
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">person</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="Enter student name"
                  required
                />
              </div>
            </div>

            {/* Father Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Father Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">family_restroom</span>
                <input
                  type="text"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="Enter father name"
                  required
                />
              </div>
            </div>

            {/* Mother Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mother Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">family_restroom</span>
                <input
                  type="text"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="Enter mother name"
                  required
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">wc</span>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">class</span>
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="Enter class"
                  required
                />
              </div>
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Roll Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">badge</span>
                <input
                  type="number"
                  name="roll_no"
                  value={formData.roll_no}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="Enter roll number"
                  required
                />
              </div>
            </div>

            {/* Section */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Section <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">category</span>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="Enter section (e.g., A, B)"
                  required
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mobile <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">phone</span>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="Enter mobile number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <div className="flex items-start border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
              <span className="material-symbols-outlined pl-2 pt-2 text-cyan-200 text-base">home</span>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
                placeholder="Enter student address"
                required
              ></textarea>
            </div>
          </div>

          {/* Uses Transport */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="uses_transport"
              checked={formData.uses_transport}
              onChange={handleChange}
              className="w-4 h-4 rounded border-cyan-300 text-cyan-500 focus:ring-cyan-400"
              id="uses_transport_edit"
            />
            <label htmlFor="uses_transport_edit" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Uses Transport
            </label>
          </div>

          {/* Transport Charge (conditional) */}
          {formData.uses_transport && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Transport Charge
              </label>
              <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">local_shipping</span>
                <input
                  type="number"
                  name="transport_charge"
                  value={formData.transport_charge || ''}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="Enter transport charge"
                  step="0.01"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-bold text-white bg-cyan-500 hover:bg-cyan-500/90 rounded-lg shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">check</span>
                  <span>Update Student</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditStudent

