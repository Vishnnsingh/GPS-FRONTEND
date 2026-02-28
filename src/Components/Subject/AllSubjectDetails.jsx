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

      let finalData = { ...subjectsResponse }

      if (classesResponse && classesResponse.length > 0) {
        if (!finalData.classes || finalData.classes.length === 0) {
          finalData.classes = classesResponse.map((cls) => {
            if (typeof cls === 'string') {
              return { class: cls, sections: [], subjects: [] }
            }
            return { class: cls.class, sections: cls.sections || [], subjects: cls.subjects || [] }
          })
        }
      }

      setData(finalData)

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

  const getClassSubjects = (classData) => {
    const sectionSubjects = Array.isArray(classData?.sections)
      ? classData.sections.flatMap((sec) => (Array.isArray(sec?.subjects) ? sec.subjects : []))
      : []
    const classSubjects = Array.isArray(classData?.subjects) ? classData.subjects : []
    const merged = [...sectionSubjects, ...classSubjects]
    const uniqueByKey = new Map()

    merged.forEach((subject, index) => {
      const key =
        String(subject?.id || '').trim() ||
        `${String(subject?.subject_name || '').trim().toLowerCase()}-${String(subject?.subject_code || '').trim().toLowerCase()}-${index}`
      if (!uniqueByKey.has(key)) uniqueByKey.set(key, subject)
    })

    return Array.from(uniqueByKey.values()).sort((a, b) => {
      const seqA = Number(a?.sequence)
      const seqB = Number(b?.sequence)
      const hasSeqA = Number.isFinite(seqA)
      const hasSeqB = Number.isFinite(seqB)
      if (hasSeqA && hasSeqB) return seqA - seqB
      if (hasSeqA) return -1
      if (hasSeqB) return 1
      return String(a?.subject_name || '').localeCompare(String(b?.subject_name || ''))
    })
  }

  const filteredClasses =
    data?.classes?.filter((cls) => {
      if (selectedClass && cls.class !== selectedClass) return false
      return true
    }) || []

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl sm:text-3xl font-black text-white">All Subject Details</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-500/90 text-white font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-lg shadow-cyan-500/20 transition-all text-xs sm:text-sm"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span className="hidden sm:inline">Add Subject</span>
            <span className="sm:hidden">Add</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-500/90 text-white font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-lg shadow-cyan-500/20 transition-all text-xs sm:text-sm"
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

      {error && (
        <div className="p-2.5 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <span className="material-symbols-outlined animate-spin text-3xl sm:text-4xl text-cyan-200">sync</span>
        </div>
      )}

      {!loading && !error && data?.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="ryme-kpi-card rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-slate-300">Total Classes</span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-300/15 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-cyan-200 text-base sm:text-lg">class</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{data.summary.total_classes}</p>
          </div>

          <div className="ryme-kpi-card rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-slate-300">Mappings</span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-300/15 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-cyan-200 text-base sm:text-lg">link</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{data.summary.total_subject_mappings}</p>
          </div>

          <div className="ryme-kpi-card rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-slate-300">Unique Subjects</span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-300/15 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-cyan-200 text-base sm:text-lg">book</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">{data.summary.total_unique_subjects}</p>
          </div>
        </div>
      )}

      {!loading && !error && data?.classes && (
        <div className="ryme-card rounded-xl p-3 sm:p-4 shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-200 mb-2">Filter by Class</label>
              <div className="flex items-center border border-cyan-200/30 dark:border-cyan-700/50 rounded-lg bg-cyan-50/30 dark:bg-cyan-900/10 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/50 transition-all">
                <span className="material-symbols-outlined pl-2 sm:pl-3 text-cyan-200 text-base">class</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 py-2 sm:py-2.5 px-2 text-xs sm:text-sm text-slate-900 dark:text-white dropdown-cyan"
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
          </div>
        </div>
      )}

      {!loading && !error && filteredClasses.length > 0 && (
        <div className="space-y-2.5 sm:space-y-3">
          {filteredClasses.map((classData) => {
            const classSubjects = getClassSubjects(classData)

            return (
              <div
                key={classData.class}
                className="ryme-card rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleClass(classData.class)}
                  className="w-full flex items-center justify-between p-3 sm:p-5 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all"
                >
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                      <span className="material-symbols-outlined text-base sm:text-lg">
                        {expandedClasses.has(classData.class) ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">Class {classData.class}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">{classSubjects.length} Subjects</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Subjects</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{classSubjects.length}</p>
                    </div>
                  </div>
                </button>

                {expandedClasses.has(classData.class) && (
                  <div className="p-3 sm:p-5 bg-slate-50/50">
                    <div className="ryme-card-soft rounded-lg p-3 sm:p-4 border border-slate-200">
                      {classSubjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                          {classSubjects.map((subject, subjectIndex) => (
                            <div
                              key={subject.id || `${subject.subject_code}-${subjectIndex}`}
                              className="bg-gradient-to-br from-slate-50 to-white rounded-lg p-2.5 sm:p-3 border border-slate-200 hover:border-cyan-400 hover:shadow-md transition-all"
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
                                <span className="flex-shrink-0 text-xs bg-cyan-300/15 text-cyan-200 dark:bg-cyan-500/20 dark:text-cyan-200 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                                  #{subject.sequence}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">No subjects found for this class</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {!loading && !error && filteredClasses.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-8 shadow-md border border-cyan-200/30 dark:border-cyan-800/50 text-center">
          <span className="material-symbols-outlined text-3xl sm:text-4xl text-cyan-200 mb-2 block">book</span>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">No subjects found</p>
        </div>
      )}

      <CreateSubject
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchSubjects()
        }}
      />

      <AddSubject
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchSubjects()
        }}
      />

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
