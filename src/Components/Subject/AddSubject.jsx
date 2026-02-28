import React, { useState, useEffect } from 'react'
import { addSubjectToClass, addMultipleSubjectsToClass, getAllSubjects } from '../../Api/subjects'

function AddSubject({ isOpen, onClose, onSuccess }) {
  const [mode, setMode] = useState('single') // 'single' or 'multiple'
  const [formData, setFormData] = useState({
    class: '',
    subject_id: '',
    subject_name: '',
    subject_code: '',
    sequence: '',
    subject_ids: ['']
  })
  const [allSubjects, setAllSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Fetch all subjects when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAllSubjects()
    }
  }, [isOpen])

  const fetchAllSubjects = async () => {
    setLoadingSubjects(true)
    try {
      const response = await getAllSubjects()
      if (response.success && response.all_subjects) {
        setAllSubjects(response.all_subjects || [])
      }
    } catch (err) {
      console.error('Failed to fetch subjects:', err)
    } finally {
      setLoadingSubjects(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubjectSelect = (e) => {
    const subjectId = e.target.value
    const selectedSubject = allSubjects.find(sub => sub.id === subjectId)
    
    if (selectedSubject) {
      setFormData(prev => ({
        ...prev,
        subject_id: selectedSubject.id,
        subject_name: selectedSubject.name,
        subject_code: selectedSubject.code
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        subject_id: '',
        subject_name: '',
        subject_code: ''
      }))
    }
    setError('')
  }

  const handleMultipleSubjectSelect = (index, subjectId) => {
    const newSubjectIds = [...formData.subject_ids]
    newSubjectIds[index] = subjectId
    setFormData(prev => ({
      ...prev,
      subject_ids: newSubjectIds
    }))
    setError('')
  }

  const addSubjectField = () => {
    setFormData(prev => ({
      ...prev,
      subject_ids: [...prev.subject_ids, '']
    }))
  }

  const removeSubjectField = (index) => {
    if (formData.subject_ids.length > 1) {
      const newSubjectIds = formData.subject_ids.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        subject_ids: newSubjectIds
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'single') {
        // Single subject
        if (!formData.class || !formData.subject_name || !formData.subject_code || !formData.sequence) {
          setError('Please fill all required fields')
          setLoading(false)
          return
        }

        const submitData = {
          class: formData.class,
          subject_name: formData.subject_name,
          subject_code: formData.subject_code,
          sequence: parseInt(formData.sequence) || 1
        }

        const response = await addSubjectToClass(submitData)

        if (response.success) {
          setSuccess(true)
          setError('')
          resetForm()
          setTimeout(() => {
            setSuccess(false)
            onSuccess?.()
            onClose()
          }, 2000)
        }
      } else {
        // Multiple subjects
        const validSubjectIds = formData.subject_ids.filter(id => id && id.trim())
        if (!formData.class || validSubjectIds.length === 0) {
          setError('Please fill all required fields and select at least one subject')
          setLoading(false)
          return
        }

        const submitData = {
          class: formData.class,
          subjects: validSubjectIds.map(subjectId => ({
            subject_id: subjectId
          }))
        }

        const response = await addMultipleSubjectsToClass(submitData)

        if (response.success) {
          setSuccess(true)
          setError('')
          resetForm()
          setTimeout(() => {
            setSuccess(false)
            onSuccess?.()
            onClose()
          }, 2000)
        }
      }
    } catch (err) {
      // Handle duplicate key error
      if (err?.error?.includes('duplicate key') || err?.error?.includes('unique constraint')) {
        setError('This subject is already added to this class. Please select a different subject or class.')
      } else if (err?.message) {
        setError(err.message)
      } else if (err?.error) {
        setError(err.error)
      } else {
        setError('Failed to add subject(s). Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      class: '',
      subject_id: '',
      subject_name: '',
      subject_code: '',
      sequence: '',
      subject_ids: ['']
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto table-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(99, 126, 153) rgb(224, 242, 254)' }}>
        {/* Header */}
        <div className="sticky top-0 bg-cyan-500 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-black">Add Subject to Class</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Subject(s) added successfully!
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex items-center gap-4 p-3 bg-cyan-50/30 dark:bg-cyan-900/10 rounded-lg border border-cyan-200/30 dark:border-cyan-700/50">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mode:</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="single"
                  checked={mode === 'single'}
                  onChange={(e) => {
                    setMode(e.target.value)
                    setError('')
                  }}
                  className="w-4 h-4 text-cyan-500 focus:ring-cyan-400"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Single Subject</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="multiple"
                  checked={mode === 'multiple'}
                  onChange={(e) => {
                    setMode(e.target.value)
                    setError('')
                  }}
                  className="w-4 h-4 text-cyan-500 focus:ring-cyan-400"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Multiple Subjects</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
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
                  placeholder="Enter class (e.g., 1, 2, LKG)"
                  required
                />
              </div>
            </div>
          </div>

          {/* Single Subject Mode */}
          {mode === 'single' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subject Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                    <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">book</span>
                    {loadingSubjects ? (
                      <div className="w-full py-1.5 px-2 text-sm text-slate-500 dark:text-slate-400">
                        Loading subjects...
                      </div>
                    ) : (
                      <select
                        name="subject_id"
                        value={formData.subject_id}
                        onChange={handleSubjectSelect}
                        className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white dropdown-cyan"
                        required
                      >
                        <option value="">Select Subject</option>
                        {allSubjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Subject Code (Read-only) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject Code
                  </label>
                  <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10">
                    <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">code</span>
                    <input
                      type="text"
                      name="subject_code"
                      value={formData.subject_code}
                      readOnly
                      className="w-full bg-transparent border-none py-1.5 px-2 text-sm text-slate-600 dark:text-slate-400 cursor-not-allowed"
                      placeholder="Auto-filled from subject"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subject Name (Read-only) */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject Name
                  </label>
                  <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10">
                    <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">book</span>
                    <input
                      type="text"
                      name="subject_name"
                      value={formData.subject_name}
                      readOnly
                      className="w-full bg-transparent border-none py-1.5 px-2 text-sm text-slate-600 dark:text-slate-400 cursor-not-allowed"
                      placeholder="Auto-filled from subject"
                    />
                  </div>
                </div>

                {/* Sequence */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Sequence <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                    <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">sort</span>
                    <input
                      type="number"
                      name="sequence"
                      value={formData.sequence}
                      onChange={handleChange}
                      className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                      placeholder="Enter sequence number"
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Multiple Subjects Mode */}
          {mode === 'multiple' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Select Subjects <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addSubjectField}
                  className="text-xs text-cyan-200 hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add More
                </button>
              </div>
              <div className="space-y-2">
                {formData.subject_ids.map((subjectId, index) => {
                  const selectedSubject = allSubjects.find(sub => sub.id === subjectId)
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1 flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400/50 transition-all">
                        <span className="material-symbols-outlined pl-2 text-cyan-200 text-base">book</span>
                        {loadingSubjects ? (
                          <div className="w-full py-1.5 px-2 text-sm text-slate-500 dark:text-slate-400">
                            Loading subjects...
                          </div>
                        ) : (
                          <select
                            value={subjectId}
                            onChange={(e) => handleMultipleSubjectSelect(index, e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white dropdown-cyan"
                          >
                            <option value="">Select Subject {index + 1}</option>
                            {allSubjects.map((subject) => (
                              <option key={subject.id} value={subject.id}>
                                {subject.name} ({subject.code})
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      {formData.subject_ids.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSubjectField(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
              {/* Display selected subjects summary */}
              {formData.subject_ids.filter(id => id).length > 0 && (
                <div className="mt-3 p-3 bg-cyan-50/30 dark:bg-cyan-900/10 rounded-lg border border-cyan-200/30 dark:border-cyan-700/50">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    Selected Subjects ({formData.subject_ids.filter(id => id).length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.subject_ids
                      .filter(id => id)
                      .map((subjectId) => {
                        const subject = allSubjects.find(sub => sub.id === subjectId)
                        return subject ? (
                          <span
                            key={subjectId}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-700 rounded text-xs text-slate-900 dark:text-white"
                          >
                            <span className="font-medium">{subject.name}</span>
                            <span className="text-slate-500 dark:text-slate-400">({subject.code})</span>
                          </span>
                        ) : null
                      })}
                  </div>
                </div>
              )}
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
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">check</span>
                  <span>Add Subject{mode === 'multiple' ? 's' : ''}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddSubject
