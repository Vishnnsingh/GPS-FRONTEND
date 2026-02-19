import React, { useState, useEffect } from 'react'
import { getAllSubjects } from '../../Api/subjects'
import { getAllClasses } from '../../Api/classes'
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
      const [subjectsResponse, classesResponse] = await Promise.all([
        getAllSubjects(),
        getAllClasses()
      ])
      
      // Ensure we have classes data - use from classesResponse if subjectsResponse doesn't have it
      let finalData = { ...subjectsResponse }
      
      if (classesResponse && classesResponse.length > 0) {
        // If getAllClasses returns data, ensure it's in the subjects response structure
        if (!finalData.classes || finalData.classes.length === 0) {
          finalData.classes = classesResponse.map(cls => {
            // Handle both string and object formats
            if (typeof cls === 'string') {
              return { class: cls, sections: [], subjects: [] }
            }
            return { class: cls.class, sections: cls.sections || [], subjects: cls.subjects || [] }
          })
        }
      }
      
      setData(finalData)
      
      // Expand first class by default
      if (finalData.classes && finalData.classes.length > 0) {
        setExpandedClasses(new Set([finalData.classes[0].class]))
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
    <div className="space-y-3 sm:space-y-4" style={{ fontFamily: "'Lexend', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0d141b] dark:text-white">All Subject Details</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-1.5 bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-lg shadow-[#137fec]/20 transition-all text-xs sm:text-sm"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span className="hidden sm:inline">Add Subject</span>
            <span className="sm:hidden">Add</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-1.5 bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-lg shadow-[#137fec]/20 transition-all text-xs sm:text-sm"
          >
            <span className="material-symbols-outlined text-base">book</span>
            <span className="hidden md:inline">Add to Class</span>
            <span className="md:hidden">Add</span>
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-lg shadow-red-600/20 transition-all text-xs sm:text-sm"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-2.5 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <span className="material-symbols-outlined animate-spin text-3xl sm:text-4xl text-[#137fec]">sync</span>
        </div>
      )}

      {/* Summary Cards */}
      {!loading && !error && data?.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Total Classes</span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#137fec]/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#137fec] text-base sm:text-lg">class</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{data.summary.total_classes}</p>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Mappings</span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#137fec]/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#137fec] text-base sm:text-lg">link</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{data.summary.total_subject_mappings}</p>
          </div>

          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Unique Subjects</span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#137fec]/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#137fec] text-base sm:text-lg">book</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{data.summary.total_unique_subjects}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      {!loading && !error && data?.classes && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 sm:p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Filter by Class */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Filter by Class
              </label>
              <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-within:border-[#137fec] focus-within:ring-2 focus-within:ring-[#137fec]/20 transition-all">
                <span className="material-symbols-outlined pl-2 sm:pl-3 text-slate-500 dark:text-slate-400 text-base">class</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 py-2 sm:py-2.5 px-2 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="">All Classes</option>
                  {data?.classes && data.classes.length > 0 ? (
                    data.classes.map((cls) => (
                      <option key={cls.class} value={cls.class}>
                        Class {cls.class}
                      </option>
                    ))
                  ) : (
                    <option disabled>No classes available</option>
                  )}
                </select>
              </div>
            </div>

            {/* Filter by Section */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                Filter by Section
              </label>
              <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus-within:border-[#137fec] focus-within:ring-2 focus-within:ring-[#137fec]/20 transition-all">
                <span className="material-symbols-outlined pl-2 sm:pl-3 text-slate-500 dark:text-slate-400 text-base">category</span>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 py-2 sm:py-2.5 px-2 text-xs sm:text-sm text-slate-900 dark:text-white"
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
        <div className="space-y-2.5 sm:space-y-3">
          {filteredClasses.map((classData) => (
            <div
              key={classData.class}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Class Header */}
              <button
                onClick={() => toggleClass(classData.class)}
                className="w-full flex items-center justify-between p-3 sm:p-5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all"
              >
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#137fec] text-white flex items-center justify-center font-bold flex-shrink-0">
                    <span className="material-symbols-outlined text-base sm:text-lg">
                      {expandedClasses.has(classData.class) ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                  <div className="text-left min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">Class {classData.class}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                      {classData.total_subjects} Subjects • {classData.total_sections} Sections
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Subjects</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">{classData.total_subjects}</p>
                  </div>
                </div>
              </button>

              {/* Class Content */}
              {expandedClasses.has(classData.class) && (
                <div className="p-3 sm:p-5 space-y-3 sm:space-y-4 bg-slate-50/50 dark:bg-slate-900/30">
                  {/* Sections */}
                  {classData.sections && classData.sections.length > 0 ? (
                    <div className="space-y-3 sm:space-y-3">
                      {filterSections(classData.sections).map((section, sectionIndex) => (
                        <div
                          key={`${classData.class}-${section.section}-${sectionIndex}`}
                          className="bg-white dark:bg-slate-800 rounded-lg p-3 sm:p-4 border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-center justify-between mb-3 pb-2 sm:pb-3 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="material-symbols-outlined text-[#137fec] text-base sm:text-lg flex-shrink-0">category</span>
                              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                                Section {section.section}
                              </h4>
                            </div>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex-shrink-0 whitespace-nowrap">
                              {section.total_subjects} Subjects
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                            {section.subjects.map((subject) => (
                              <div
                                key={subject.id}
                                className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-lg p-2.5 sm:p-3 border border-slate-200 dark:border-slate-600 hover:border-[#137fec] hover:shadow-md transition-all"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-2">
                                      {subject.subject_name}
                                    </h5>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                      <span className="font-medium text-slate-700 dark:text-slate-300">{subject.subject_code}</span>
                                    </p>
                                  </div>
                                  <span className="flex-shrink-0 text-xs bg-[#137fec]/10 text-[#137fec] dark:bg-[#137fec]/20 dark:text-[#137fec] px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
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
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-3 sm:p-4 border border-slate-200 dark:border-slate-700">
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3 sm:mb-4">
                        No sections defined. Showing all subjects for this class:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                        {classData.subjects.map((subject) => (
                          <div
                            key={subject.id}
                            className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 rounded-lg p-2.5 sm:p-3 border border-slate-200 dark:border-slate-600 hover:border-[#137fec] hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-2">
                                  {subject.subject_name}
                                </h5>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  <span className="font-medium text-slate-700 dark:text-slate-300">{subject.subject_code}</span>
                                </p>
                              </div>
                              <span className="flex-shrink-0 text-xs bg-[#137fec]/10 text-[#137fec] dark:bg-[#137fec]/20 dark:text-[#137fec] px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
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
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-8 shadow-md border border-blue-200 dark:border-blue-800 text-center">
          <span className="material-symbols-outlined text-3xl sm:text-4xl text-slate-400 mb-2 block">book</span>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">No subjects found</p>
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
