import React, { useState, useEffect } from 'react'
import { getAllSubjects } from '../../Api/subjects'
import AddSubject from './AddSubject'
import CreateSubject from './CreateSubject'
import DeleteSubject from './DeleteSubject'

function AllSubjectDetails() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [expandedClasses, setExpandedClasses] = useState(new Set())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getAllSubjects()
      if (response.success) {
        setData(response)
        // Expand first class by default
        if (response.classes && response.classes.length > 0) {
          setExpandedClasses(new Set([response.classes[0].class]))
        }
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch subjects')
    } finally {
      setLoading(false)
    }
  }

  const toggleClass = (classValue) => {
    const newExpanded = new Set(expandedClasses)
    if (newExpanded.has(classValue)) {
      newExpanded.delete(classValue)
    } else {
      newExpanded.add(classValue)
    }
    setExpandedClasses(newExpanded)
  }

  // Get all unique sections from all classes
  const getAllSections = () => {
    if (!data?.classes) return []
    const sections = new Set()
    data.classes.forEach(cls => {
      if (cls.sections && cls.sections.length > 0) {
        cls.sections.forEach(sec => {
          sections.add(sec.section)
        })
      }
    })
    return Array.from(sections).sort()
  }

  // Filter classes based on selected filters
  const filteredClasses = data?.classes?.filter(cls => {
    // Class filter
    if (selectedClass && cls.class !== selectedClass) return false

    // Section filter - check if class has the selected section
    if (selectedSection) {
      const hasSection = cls.sections?.some(sec => sec.section === selectedSection)
      if (!hasSection) return false
    }

    return true
  }) || []

  // Filter sections within a class based on selected section
  const filterSections = (sections) => {
    if (!selectedSection) return sections
    return sections.filter(sec => sec.section === selectedSection)
  }

  const uniqueSections = getAllSections()

  return (
    <div className="space-y-4" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#0d141b] dark:text-white">All Subject Details</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold px-4 py-2 rounded-lg shadow-lg shadow-[#137fec]/20 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add Subject</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold px-4 py-2 rounded-lg shadow-lg shadow-[#137fec]/20 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-base">book</span>
            <span>Add Subject to Class</span>
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg shadow-lg shadow-red-600/20 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            <span>Delete Subject</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <span className="material-symbols-outlined animate-spin text-4xl text-[#137fec]">sync</span>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && !error && data?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Classes</span>
              <div className="w-10 h-10 rounded-lg bg-[#137fec]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#137fec] text-lg">class</span>
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{data.summary.total_classes}</p>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Subject Mappings</span>
              <div className="w-10 h-10 rounded-lg bg-[#137fec]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#137fec] text-lg">link</span>
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{data.summary.total_subject_mappings}</p>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Unique Subjects</span>
              <div className="w-10 h-10 rounded-lg bg-[#137fec]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#137fec] text-lg">book</span>
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{data.summary.total_unique_subjects}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      {!loading && !error && data?.classes && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Filter by Class */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Filter by Class
              </label>
              <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-within:border-[#137fec] focus-within:ring-2 focus-within:ring-[#137fec]/20 transition-all">
                <span className="material-symbols-outlined pl-3 text-slate-500 dark:text-slate-400 text-base">class</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 py-2.5 px-2 text-sm text-slate-900 dark:text-white"
                >
                  <option value="">All Classes</option>
                  {data.classes.map((cls) => (
                    <option key={cls.class} value={cls.class}>
                      Class {cls.class}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter by Section */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Filter by Section
              </label>
              <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-within:border-[#137fec] focus-within:ring-2 focus-within:ring-[#137fec]/20 transition-all">
                <span className="material-symbols-outlined pl-3 text-slate-500 dark:text-slate-400 text-base">category</span>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 py-2.5 px-2 text-sm text-slate-900 dark:text-white"
                >
                  <option value="">All Sections</option>
                  {uniqueSections.map((section) => (
                    <option key={section} value={section}>
                      Section {section}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Classes List */}
      {!loading && !error && filteredClasses.length > 0 && (
        <div className="space-y-3">
          {filteredClasses.map((classData) => (
            <div
              key={classData.class}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Class Header */}
              <button
                onClick={() => toggleClass(classData.class)}
                className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#137fec] text-white flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">
                      {expandedClasses.has(classData.class) ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Class {classData.class}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {classData.total_subjects} Subjects • {classData.total_sections} Sections
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Subjects</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{classData.total_subjects}</p>
                  </div>
                </div>
              </button>

              {/* Class Content */}
              {expandedClasses.has(classData.class) && (
                <div className="p-5 space-y-4 bg-slate-50/50 dark:bg-slate-900/30">
                  {/* Sections */}
                  {classData.sections && classData.sections.length > 0 ? (
                    <div className="space-y-3">
                      {filterSections(classData.sections).map((section, sectionIndex) => (
                        <div
                          key={`${classData.class}-${section.section}-${sectionIndex}`}
                          className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[#137fec] text-lg">category</span>
                              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                                Section {section.section}
                              </h4>
                            </div>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
                              {section.total_subjects} Subjects
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {section.subjects.map((subject) => (
                              <div
                                key={subject.id}
                                className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600 hover:border-[#137fec] hover:shadow-md transition-all"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1 truncate">
                                      {subject.subject_name}
                                    </h5>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      <span className="font-medium text-slate-700 dark:text-slate-300">{subject.subject_code}</span>
                                    </p>
                                  </div>
                                  <span className="flex-shrink-0 ml-2 text-xs bg-[#137fec]/10 text-[#137fec] dark:bg-[#137fec]/20 dark:text-[#137fec] px-2 py-0.5 rounded font-medium">
                                    #{subject.sequence}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        No sections defined. Showing all subjects for this class:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {classData.subjects.map((subject) => (
                          <div
                            key={subject.id}
                            className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600 hover:border-[#137fec] hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1 truncate">
                                  {subject.subject_name}
                                </h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  <span className="font-medium text-slate-700 dark:text-slate-300">{subject.subject_code}</span>
                                </p>
                              </div>
                              <span className="flex-shrink-0 ml-2 text-xs bg-[#137fec]/10 text-[#137fec] dark:bg-[#137fec]/20 dark:text-[#137fec] px-2 py-0.5 rounded font-medium">
                                #{subject.sequence}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No Data */}
      {!loading && !error && filteredClasses.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md border border-blue-200 dark:border-blue-800 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">book</span>
          <p className="text-sm text-slate-500 dark:text-slate-400">No subjects found</p>
        </div>
      )}

      {/* Create Subject Modal */}
      <CreateSubject
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchSubjects()
        }}
      />

      {/* Add Subject to Class Modal */}
      <AddSubject
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchSubjects()
        }}
        availableClasses={data?.classes?.map(cls => cls.class) || []}
        availableSections={uniqueSections}
      />

      {/* Delete Subject Modal */}
      <DeleteSubject
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={() => {
          fetchSubjects()
        }}
      />
    </div>
  )
}

export default AllSubjectDetails
