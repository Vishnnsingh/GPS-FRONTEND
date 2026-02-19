import React, { useState, useEffect } from 'react'
import { getAllSubjects, getSubjectsForClass } from '../../Api/subjects'
import { getAllClasses } from '../../Api/classes'
import { getAllStudents } from '../../Api/students'
import { submitMarks } from '../../Api/marks'

function SubmitMarks() {
  const [formData, setFormData] = useState({
    class: '',
    section: '',
    terminal: '',
    roll_no: '',
    marks: []
  })
  const [subjectsData, setSubjectsData] = useState(null)
  const [availableSubjects, setAvailableSubjects] = useState([])
  const [availableClasses, setAvailableClasses] = useState([])
  const [availableSections, setAvailableSections] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const terminals = ['First', 'Second', 'Third', 'Final']

  useEffect(() => {
    fetchSubjects()
  }, [])

  useEffect(() => {
    if (formData.class) {
      loadSectionsForClass()
    } else {
      setAvailableSections([])
      setAvailableSubjects([])
      setFormData(prev => ({ ...prev, section: '', marks: [] }))
    }
  }, [formData.class])

  useEffect(() => {
    if (formData.class && formData.section) {
      loadSubjectsForClassSection()
    } else {
      setAvailableSubjects([])
      setFormData(prev => ({ ...prev, marks: [] }))
    }
  }, [formData.section])

  const fetchSubjects = async () => {
    setLoadingSubjects(true)
    setError('')
    try {
      const [subjectsResponse, classesResponse] = await Promise.all([
        getAllSubjects(),
        getAllClasses()
      ])
      
      if (subjectsResponse.success) {
        setSubjectsData(subjectsResponse)
      }
      
      if (classesResponse && classesResponse.length > 0) {
        // Sort by class property (numeric sort)
        const sorted = classesResponse.sort((a, b) => {
          const classA = typeof a === 'string' ? a : a.class;
          const classB = typeof b === 'string' ? b : b.class;
          return parseInt(classA) - parseInt(classB);
        });
        setAvailableClasses(sorted)
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch subjects and classes')
    } finally {
      setLoadingSubjects(false)
    }
  }

  const loadSectionsForClass = async () => {
    if (!formData.class) return
    
    try {
      const students = await getAllStudents(formData.class)
      if (students && students.length > 0) {
        const uniqueSections = [...new Set(students.map(s => s.Section))].filter(Boolean).sort()
        setAvailableSections(uniqueSections)
        if (uniqueSections.length === 0) {
          setFormData(prev => ({ ...prev, section: '' }))
        }
      } else {
        setAvailableSections([])
        setFormData(prev => ({ ...prev, section: '' }))
      }
    } catch (err) {
      console.error('Error loading sections:', err)
      setAvailableSections([])
    }
  }

  const loadSubjectsForClassSection = () => {
    if (!subjectsData?.classes) return

    // Find the selected class
    const selectedClassData = subjectsData.classes.find(cls => cls.class === formData.class)
    if (!selectedClassData) {
      setAvailableSubjects([])
      setFormData(prev => ({ ...prev, marks: [] }))
      return
    }

    // Get subjects for the selected class and section
    let subjects = []
    if (selectedClassData.sections && selectedClassData.sections.length > 0) {
      // Find the section
      const selectedSectionData = selectedClassData.sections.find(sec => sec.section === formData.section)
      if (selectedSectionData && selectedSectionData.subjects) {
        subjects = selectedSectionData.subjects
      }
    } else {
      // If no sections, use class-level subjects
      if (selectedClassData.subjects) {
        subjects = selectedClassData.subjects
      }
    }

    // Set available subjects and initialize marks
    setAvailableSubjects(subjects)
    setFormData(prev => ({
      ...prev,
      marks: subjects.map(subject => ({
        subject_name: subject.subject_name || '',
        subject_code: subject.subject_code || '',
        external_marks: '',
        internal_marks: ''
      }))
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleMarksChange = (index, field, value) => {
    const newMarks = [...formData.marks]
    newMarks[index] = {
      ...newMarks[index],
      [field]: value === '' ? '' : parseFloat(value) || 0
    }
    setFormData(prev => ({
      ...prev,
      marks: newMarks
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validation
      if (!formData.class || !formData.section || !formData.terminal || !formData.roll_no) {
        setError('Please fill all required fields')
        setLoading(false)
        return
      }

      if (!formData.marks || formData.marks.length === 0) {
        setError('No subjects found for the selected class and section')
        setLoading(false)
        return
      }

      // Prepare marks data - use subject_name or subject_code based on what's available
      const marksData = formData.marks.map(mark => {
        const markObj = {}
        if (mark.subject_name) {
          markObj.subject_name = mark.subject_name
        }
        if (mark.subject_code) {
          markObj.subject_code = mark.subject_code
        }
        markObj.external_marks = parseFloat(mark.external_marks) || 0
        markObj.internal_marks = parseFloat(mark.internal_marks) || 0
        return markObj
      }).filter(mark => mark.external_marks > 0 || mark.internal_marks > 0) // Only include marks that have values

      if (marksData.length === 0) {
        setError('Please enter at least one mark')
        setLoading(false)
        return
      }

      const submitData = {
        class: formData.class,
        section: formData.section,
        terminal: formData.terminal,
        roll_no: parseInt(formData.roll_no) || 0,
        marks: marksData
      }

      const response = await submitMarks(submitData)

      if (response.success) {
        setSuccess(true)
        setError('')
        // Reset form
        setFormData({
          class: '',
          section: '',
          terminal: '',
          roll_no: '',
          marks: []
        })
        setAvailableSubjects([])
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      }
    } catch (err) {
      let errorMessage = 'Failed to submit marks'
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.error) {
        errorMessage = err.error
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#0d141b] dark:text-white">Submit Marks</h2>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            Marks submitted successfully!
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Class */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Class <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-within:border-[#137fec] focus-within:ring-2 focus-within:ring-[#137fec]/20 transition-all">
              <span className="material-symbols-outlined pl-3 text-slate-500 dark:text-slate-400 text-base">class</span>
              {loadingSubjects ? (
                <div className="w-full py-2.5 px-2 text-sm text-slate-500 dark:text-slate-400">
                  Loading...
                </div>
              ) : (
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full bg-transparent border-none focus:ring-0 py-2.5 px-2 text-sm text-slate-900 dark:text-white"
                  required
                >
                  <option value="">Select Class</option>
                  {availableClasses.map((cls) => (
                    <option key={cls.class || cls} value={cls.class || cls}>
                      Class {cls.class || cls}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Section */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Section <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-within:border-[#137fec] focus-within:ring-2 focus-within:ring-[#137fec]/20 transition-all">
              <span className="material-symbols-outlined pl-3 text-slate-500 dark:text-slate-400 text-base">category</span>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full bg-transparent border-none focus:ring-0 py-2.5 px-2 text-sm text-slate-900 dark:text-white"
                required
                disabled={!formData.class}
              >
                <option value="">Select Section</option>
                {availableSections.map((section) => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Terminal */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Terminal <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-within:border-[#137fec] focus-within:ring-2 focus-within:ring-[#137fec]/20 transition-all">
              <span className="material-symbols-outlined pl-3 text-slate-500 dark:text-slate-400 text-base">calendar_today</span>
              <select
                name="terminal"
                value={formData.terminal}
                onChange={handleChange}
                className="w-full bg-transparent border-none focus:ring-0 py-2.5 px-2 text-sm text-slate-900 dark:text-white"
                required
              >
                <option value="">Select Terminal</option>
                {terminals.map((terminal) => (
                  <option key={terminal} value={terminal}>
                    {terminal}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Roll Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-within:border-[#137fec] focus-within:ring-2 focus-within:ring-[#137fec]/20 transition-all">
              <span className="material-symbols-outlined pl-3 text-slate-500 dark:text-slate-400 text-base">badge</span>
              <input
                type="number"
                name="roll_no"
                value={formData.roll_no}
                onChange={handleChange}
                className="w-full bg-transparent border-none focus:ring-0 py-2.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="Enter roll number"
                min="1"
                required
              />
            </div>
          </div>
        </div>

        {/* Subjects and Marks */}
        {formData.class && formData.section && availableSubjects.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Enter Marks for Subjects
              </h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {availableSubjects.length} Subject{availableSubjects.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-3">
              {formData.marks.map((mark, index) => {
                const subject = availableSubjects[index]
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {subject.subject_name}
                        </h4>
                        {subject.subject_code && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Code: {subject.subject_code}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* External Marks */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          External Marks
                        </label>
                        <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-within:border-[#137fec] focus-within:ring-2 focus-within:ring-[#137fec]/20 transition-all">
                          <span className="material-symbols-outlined pl-3 text-slate-500 dark:text-slate-400 text-base">assessment</span>
                          <input
                            type="number"
                            value={mark.external_marks || ''}
                            onChange={(e) => handleMarksChange(index, 'external_marks', e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 py-2 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                            placeholder="Enter external marks"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                        </div>
                      </div>

                      {/* Internal Marks */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Internal Marks
                        </label>
                        <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-within:border-[#137fec] focus-within:ring-2 focus-within:ring-[#137fec]/20 transition-all">
                          <span className="material-symbols-outlined pl-3 text-slate-500 dark:text-slate-400 text-base">grade</span>
                          <input
                            type="number"
                            value={mark.internal_marks || ''}
                            onChange={(e) => handleMarksChange(index, 'internal_marks', e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 py-2 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                            placeholder="Enter internal marks"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* No Subjects Message */}
        {formData.class && formData.section && availableSubjects.length === 0 && !loadingSubjects && (
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6 text-center border-2 border-dashed border-slate-300 dark:border-slate-600">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">book</span>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              No subjects found for Class {formData.class}, Section {formData.section}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="submit"
            disabled={loading || !formData.class || !formData.section || !formData.terminal || !formData.roll_no || availableSubjects.length === 0}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#137fec] hover:bg-[#137fec]/90 rounded-lg shadow-lg shadow-[#137fec]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-base">sync</span>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">check</span>
                <span>Submit Marks</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SubmitMarks
