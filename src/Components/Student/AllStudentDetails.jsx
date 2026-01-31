import React, { useState, useEffect } from 'react'
import { getAllStudents, deleteStudent } from '../../Api/students'
import AddStudent from './AddStudent'
import EditStudent from './EditStudent'

function AllStudentDetails() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [count, setCount] = useState(0)
  const [classFilter, setClassFilter] = useState('')
  const [rollFilter, setRollFilter] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const itemsPerPage = 10

  useEffect(() => {
    fetchStudents()
  }, [classFilter, rollFilter, sectionFilter])

  const fetchStudents = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getAllStudents(classFilter)
      if (response.success) {
        const studentsList = response.students || []
        // Log first student to see structure (for debugging)
        if (studentsList.length > 0) {
          console.log('Sample student object:', studentsList[0])
        }
        setStudents(studentsList)
        setCount(response.count || 0)
        setCurrentPage(1) // Reset to first page on new filter
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  // Filter students by search term, roll, and section
  const filteredStudents = students.filter(student => {
    // Search term filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      const matchesSearch = (
        student.Name?.toLowerCase().includes(search) ||
        student.Father?.toLowerCase().includes(search) ||
        student.Roll?.toString().includes(search) ||
        student.Class?.toString().includes(search) ||
        student.Section?.toLowerCase().includes(search) ||
        student.Mobile?.includes(search)
      )
      if (!matchesSearch) return false
    }

    // Roll filter
    if (rollFilter && student.Roll?.toString() !== rollFilter) {
      return false
    }

    // Section filter
    if (sectionFilter && student.Section?.toLowerCase() !== sectionFilter.toLowerCase()) {
      return false
    }

    return true
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex)

  // Get unique sections for filter dropdown
  const uniqueSections = [...new Set(students.map(s => s.Section).filter(Boolean))].sort()

  const handleDelete = async (student) => {
    if (!window.confirm(`Are you sure you want to delete ${student.Name}?`)) {
      return
    }

    // Try multiple possible ID field names (API uses ID uppercase)
    const studentId = student.ID || student._id || student.id || student.Id || student.student_id || student.StudentId
    
    if (!studentId) {
      // If no ID found, log for debugging
      console.error('Student data (no ID found):', student)
      setError('Student ID not found. Cannot delete student.')
      return
    }

    setDeletingId(studentId)
    setError('')
    try {
      const response = await deleteStudent(studentId)
      if (response.success) {
        // Refresh student list
        fetchStudents()
      }
    } catch (err) {
      setError(err?.message || 'Failed to delete student')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-[#0d141b] dark:text-white">All Student Details</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Total: <span className="font-bold text-[#137fec]">{count}</span> students
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-[#137fec] hover:bg-[#137fec]/90 text-white font-bold px-4 py-2 rounded-lg shadow-lg shadow-[#137fec]/20 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>Add New Student</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 shadow-md border border-blue-200 dark:border-blue-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Class Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Filter by Class
            </label>
            <div className="flex items-center border border-blue-200 dark:border-blue-700 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
              <span className="material-symbols-outlined pl-2 text-[#137fec] text-base">class</span>
              <input
                type="text"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                placeholder="Enter class (e.g., 1, 4)"
                className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Roll Number Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Filter by Roll Number
            </label>
            <div className="flex items-center border border-blue-200 dark:border-blue-700 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
              <span className="material-symbols-outlined pl-2 text-[#137fec] text-base">badge</span>
              <input
                type="text"
                value={rollFilter}
                onChange={(e) => setRollFilter(e.target.value)}
                placeholder="Enter roll number"
                className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Section Filter */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Filter by Section
            </label>
            <div className="flex items-center border border-blue-200 dark:border-blue-700 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
              <span className="material-symbols-outlined pl-2 text-[#137fec] text-base">category</span>
              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white"
              >
                <option value="">All Sections</option>
                {uniqueSections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Search Students
            </label>
            <div className="flex items-center border border-blue-200 dark:border-blue-700 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 focus-within:border-[#137fec] focus-within:ring-1 focus-within:ring-[#137fec] transition-all">
              <span className="material-symbols-outlined pl-2 text-[#137fec] text-base">search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
                placeholder="Search by name, etc."
                className="w-full bg-transparent border-none focus:ring-0 py-1.5 px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>
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

      {/* Students Table */}
      {!loading && !error && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-blue-200 dark:border-blue-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#137fec]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                    S.No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                    Roll
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                    Father Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                    Class
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                    Section
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                    Mobile
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                    Transport
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                      No students found
                    </td>
                  </tr>
                ) : (
                  paginatedStudents.map((student, index) => (
                    <tr key={index} className="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                        {student.Roll || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                        {student.Name || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {student.Father || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {student.Class || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {student.Section || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {student.Mobile || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {student.Address || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {student.Transport && student.Transport !== "No" && typeof student.Transport === 'number' ? (
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              Yes
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              ₹{student.Transport}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                            <span className="material-symbols-outlined text-sm">cancel</span>
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedStudent(student)
                              setIsEditModalOpen(true)
                            }}
                            className="p-1.5 text-[#137fec] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(student)}
                            disabled={deletingId === (student.ID || student._id || student.id || student.Id || student.student_id || student.StudentId)}
                            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete"
                          >
                            {deletingId === (student.ID || student._id || student.id || student.Id || student.student_id || student.StudentId) ? (
                              <span className="material-symbols-outlined animate-spin text-base">sync</span>
                            ) : (
                              <span className="material-symbols-outlined text-base">delete</span>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && filteredStudents.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 shadow-md border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing <span className="font-medium text-slate-900 dark:text-white">{startIndex + 1}</span> to{' '}
              <span className="font-medium text-slate-900 dark:text-white">
                {Math.min(endIndex, filteredStudents.length)}
              </span>{' '}
              of <span className="font-medium text-slate-900 dark:text-white">{filteredStudents.length}</span> students
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-[#137fec] text-white'
                            : 'text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 3 || page === currentPage + 3) {
                    return (
                      <span key={page} className="px-2 text-slate-500 dark:text-slate-400">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      <AddStudent
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchStudents()
        }}
      />

      {/* Edit Student Modal */}
      <EditStudent
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedStudent(null)
        }}
        onSuccess={() => {
          fetchStudents()
        }}
        studentData={selectedStudent}
      />
    </div>
  )
}

export default AllStudentDetails
