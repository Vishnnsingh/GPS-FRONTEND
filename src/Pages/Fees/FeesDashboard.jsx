import React, { useState, useEffect, useMemo } from 'react'
import { getFeeList } from '../../Api/fees'

function FeesDashboard() {
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('2026-01')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [viewMode, setViewMode] = useState('student-list') // 'student-list' or 'year-history'

  const classes = ['Mother Care', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8']

  useEffect(() => {
    if (classFilter && selectedMonth) {
      fetchAllStudentsInClass()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classFilter, selectedMonth])

  const fetchAllStudentsInClass = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('[fetchAllStudentsInClass] Starting fetch:', { classFilter, selectedMonth })
      
      const response = await getFeeList(classFilter, '', selectedMonth)
      const data = Array.isArray(response.data) ? response.data : Array.isArray(response.fees) ? response.fees : Array.isArray(response) ? response : []
      console.log('[fetchAllStudentsInClass] Data received:', { month: selectedMonth, recordCount: data.length })
      
      // Get unique students
      const uniqueStudents = Array.from(new Map(
        data.map(item => [item.roll_number, item])
      ).values())
      
      console.log('[fetchAllStudentsInClass] Unique students:', uniqueStudents.length)
      
      setFees(uniqueStudents.sort((a, b) => 
        (a.student_name || '').localeCompare(b.student_name || '')
      ))
    } catch (error) {
      console.error('[fetchAllStudentsInClass] Error:', error)
      setError('Failed to fetch students data')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student)
    setViewMode('year-history')
    console.log('[handleSelectStudent] Selected student:', { name: student.student_name, roll: student.roll_number, month: selectedMonth })
  }

  // Calculate stats for selected student
  const annualStats = useMemo(() => {
    if (!selectedStudent) {
      return {
        totalFee: 0,
        totalPaid: 0,
        totalBalance: 0,
        paymentPercentage: 0
      }
    }

    const totalFee = selectedStudent.total_amount || 0
    const totalPaid = selectedStudent.paid_amount || 0
    const totalBalance = selectedStudent.pending_amount || 0
    const paymentPercentage = totalFee > 0 ? Math.round((totalPaid / totalFee) * 100) : 0

    return {
      totalFee,
      totalPaid,
      totalBalance,
      paymentPercentage
    }
  }, [selectedStudent])

  // Calculate statistics for student list
  const statistics = useMemo(() => {
    const totalStudents = fees.length
    const totalFee = fees.reduce((sum, f) => sum + (f.total_amount || 0), 0)
    const totalPaid = fees.reduce((sum, f) => sum + (f.paid_amount || 0), 0)
    const totalBalance = fees.reduce((sum, f) => sum + Math.max(f.pending_amount || 0, 0), 0)
    // Count fully paid students (status is 'paid' or pending_amount is 0)
    const paidCount = fees.filter(f => f.status === 'paid' || (f.pending_amount || 0) === 0).length
    const paymentPercentage = totalFee > 0 ? Math.round((totalPaid / totalFee) * 100) : 0
    
    return {
      totalStudents,
      totalFee,
      totalPaid,
      totalBalance,
      paidCount,
      paymentPercentage,
      pendingCount: totalStudents - paidCount
    }
  }, [fees])

  const getBalanceColor = (balance) => {
    if (balance === 0) return 'text-emerald-600 dark:text-emerald-400'
    if (balance < 0) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="w-full h-full bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-y-auto" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div className="px-2 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 space-y-4 sm:space-y-6">
      
      {/* Professional Header */}
      <div className="space-y-1 sm:space-y-2">
        <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
          <div className="p-1.5 xs:p-2 bg-linear-to-br from-[#137fec] to-blue-600 rounded-lg w-fit">
            <span className="material-symbols-outlined text-white text-lg xs:text-xl">account_balance_wallet</span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">Fees Dashboard</h1>
            <p className="text-xs xs:text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 xs:mt-1 truncate">
              {viewMode === 'student-list' ? 'Select student to view fee history' : `Fee Report - ${selectedStudent?.student_name}`}
            </p>
          </div>
        </div>
      </div>

      {/* MODE 1: STUDENT LIST VIEW */}
      {viewMode === 'student-list' ? (
        <>
          {/* Filter Section */}
          <div className="flex flex-col gap-2 xs:gap-2.5 sm:flex-row sm:gap-3 md:gap-4 sm:items-end">
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg xs:rounded-lg sm:rounded-xl p-2 xs:p-2.5 sm:p-4 md:p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <label className="flex text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 xs:mb-2 uppercase tracking-wider items-center gap-1.5">
                <span className="material-symbols-outlined text-[#137fec] text-sm">school</span>
                <span className="hidden xs:inline">Select Class</span>
                <span className="xs:hidden">Class</span>
              </label>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-3 border border-slate-300 dark:border-slate-600 rounded-lg xs:rounded-lg sm:rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-[#137fec] focus:border-transparent transition-all duration-200 text-xs xs:text-sm sm:text-base"
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Calendar Picker */}
            <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg xs:rounded-lg sm:rounded-xl p-2 xs:p-2.5 sm:p-4 md:p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
              <label className="flex text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 xs:mb-2 uppercase tracking-wider items-center gap-1.5">
                <span className="material-symbols-outlined text-[#137fec] text-sm">calendar_month</span>
                <span className="hidden xs:inline">Select Month</span>
                <span className="xs:hidden">Month</span>
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-3 border border-slate-300 dark:border-slate-600 rounded-lg xs:rounded-lg sm:rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-[#137fec] focus:border-transparent transition-all duration-200 text-xs xs:text-sm sm:text-base"
              />
            </div>

            <button
              onClick={() => {
                setClassFilter('')
                setSelectedMonth('2026-01')
                setFees([])
              }}
              className="px-2.5 xs:px-4 sm:px-6 py-1.5 xs:py-2 sm:py-3 bg-linear-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-lg xs:rounded-lg sm:rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-xs xs:text-sm sm:text-base h-fit sm:h-auto"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              <span className="hidden xs:inline">Reset</span>
            </button>
          </div>

          {/* Main Content */}
          {loading ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-lg">
              <div className="flex flex-col items-center gap-4 sm:gap-6">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                  <div className="absolute inset-0 bg-linear-to-r from-[#137fec] to-blue-600 rounded-full opacity-20 animate-pulse"></div>
                  <span className="material-symbols-outlined animate-spin text-4xl sm:text-5xl text-[#137fec] absolute inset-0 flex items-center justify-center">sync</span>
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Loading Students</p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Fetching all students in this class...</p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg sm:rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                <div className="p-2 sm:p-3 bg-red-100 dark:bg-red-900/30 rounded-lg sm:rounded-xl shrink-0">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl sm:text-2xl">error_circle</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-red-800 dark:text-red-300 text-sm sm:text-base">Error Loading Data</p>
                  <p className="text-xs sm:text-sm text-red-700 dark:text-red-400 wrap-break-word">{error}</p>
                </div>
              </div>
              <button onClick={() => setError('')} className="text-red-700 dark:text-red-300 p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition shrink-0">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          ) : fees.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-8 sm:p-16 border border-slate-200 dark:border-slate-700 text-center shadow-lg">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="p-4 sm:p-6 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-xl sm:rounded-2xl">
                  <span className="material-symbols-outlined text-5xl sm:text-7xl text-slate-400 dark:text-slate-500">folder_open</span>
                </div>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">No Students Found</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg">Select a class to view students</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              
              {/* Summary Statistics */}
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-2.5 sm:gap-3 md:gap-4">
                <div className="group bg-white dark:bg-slate-800 rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 overflow-hidden relative">
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-start justify-between mb-2 relative z-10">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Total Students</p>
                      <p className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white wrap-break-word">{statistics.totalStudents}</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform shrink-0">
                      <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl sm:text-2xl">people</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 relative z-10">Enrolled in selected class</p>
                </div>

                <div className="group bg-white dark:bg-slate-800 rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 overflow-hidden relative">
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-start justify-between mb-2 relative z-10">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">Fees Paid</p>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white wrap-break-word">₹{statistics.totalPaid.toLocaleString()}</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform shrink-0">
                      <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-xl sm:text-2xl">check_circle</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 relative z-10">{statistics.paidCount} students paid</p>
                </div>

                <div className="group bg-white dark:bg-slate-800 rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-red-300 dark:hover:border-red-600 transition-all duration-300 overflow-hidden relative">
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-start justify-between mb-2 relative z-10">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Pending Balance</p>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white wrap-break-word">₹{statistics.totalBalance.toLocaleString()}</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-red-100 dark:bg-red-900/30 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform shrink-0">
                      <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl sm:text-2xl">schedule</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 relative z-10">{statistics.pendingCount} students pending</p>
                </div>
              </div>

              {/* Students Grid */}
              <div className="bg-white dark:bg-slate-800 rounded-lg xs:rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-md">
                <div className="bg-linear-to-r from-slate-50 to-blue-50 dark:from-slate-700/50 dark:to-blue-900/20 p-2.5 xs:p-3 sm:p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm xs:text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm xs:text-base">people</span>
                    Students List
                  </h3>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 p-2.5 xs:p-3 sm:p-4 md:p-6">
                  {fees.map((student, index) => (
                    <div 
                      key={index}
                      onClick={() => handleSelectStudent(student)}
                      className="group bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-lg sm:rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden relative"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="flex items-start gap-3 sm:gap-4 relative z-10 mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-linear-to-br from-[#137fec] to-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-md group-hover:scale-110 transition-transform shrink-0">
                          {student.student_name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate text-sm sm:text-lg">{student.student_name || 'N/A'}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                            Class: {student.class} • Roll: #{student.roll_number || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 relative z-10">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Fee Status</span>
                          <span className={`text-xs font-bold px-2 sm:px-3 py-1 rounded-full ${
                            student.status === 'paid' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : student.status === 'partial'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {student.status === 'paid' ? '✓ Paid' : student.status === 'partial' ? '⚠ Partial' : '⌛ Pending'}
                          </span>
                        </div>
                        
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-600 flex justify-between text-xs sm:text-sm">
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Paid</p>
                            <p className="font-bold text-slate-900 dark:text-white">₹{(student.paid_amount || 0).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-600 dark:text-slate-400">Pending</p>
                            <p className={`font-bold ${getBalanceColor(student.pending_amount || 0)}`}>₹{Math.abs(student.pending_amount || 0).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg sm:text-2xl">arrow_forward</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        // MODE 2: YEAR HISTORY VIEW
        <div className="space-y-3 sm:space-y-4 md:space-y-6\">
          
          {/* Back Button */}
          <button
            onClick={() => {
              setViewMode('student-list')
              setSelectedStudent(null)
            }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors font-semibold text-sm sm:text-base"
          >
            <span className="material-symbols-outlined text-sm sm:text-base">arrow_back</span>
            Back to Students
          </button>

          {/* Student Header */}
          {selectedStudent && (
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg sm:rounded-2xl p-4 sm:p-8 border border-blue-200 dark:border-blue-800 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg sm:rounded-2xl bg-linear-to-br from-[#137fec] to-blue-600 flex items-center justify-center text-white font-bold text-lg sm:text-3xl shrink-0">
                  {selectedStudent.student_name?.charAt(0)?.toUpperCase() || 'S'}
                </div>
                <div className="min-w-0">
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white wrap-break-word">{selectedStudent.student_name}</h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 sm:mt-2 flex flex-wrap items-center gap-2">
                    <span className="material-symbols-outlined text-xs sm:text-sm">school</span>
                    <span className="whitespace-nowrap">Class: {selectedStudent.class}</span>
                    <span>•</span>
                    <span className="whitespace-nowrap">Section: {selectedStudent.section || 'N/A'}</span>
                    <span>•</span>
                    <span className="whitespace-nowrap">Roll: {selectedStudent.roll_number}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Annual Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Total Fee */}
            <div className="group bg-white dark:bg-slate-800 rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 overflow-hidden relative">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-start justify-between mb-2 relative z-10">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Total Fee</p>
                  <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white wrap-break-word">₹{annualStats.totalFee.toLocaleString()}</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform shrink-0">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg sm:text-2xl">account_balance</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 relative z-10">For {selectedMonth}</p>
            </div>

            {/* Total Paid */}
            <div className="group bg-white dark:bg-slate-800 rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 overflow-hidden relative">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-start justify-between mb-2 relative z-10">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">Total Paid</p>
                  <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white wrap-break-word">₹{annualStats.totalPaid.toLocaleString()}</p>
                </div>
                <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform shrink-0">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-lg sm:text-2xl">verified</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 relative z-10">Payment status for {selectedMonth}</p>
            </div>

            {/* Outstanding Balance */}
            <div className="group bg-white dark:bg-slate-800 rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-red-300 dark:hover:border-red-600 transition-all duration-300 overflow-hidden relative">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-start justify-between mb-2 relative z-10">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Balance Due</p>
                  <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white wrap-break-word">₹{annualStats.totalBalance.toLocaleString()}</p>
                </div>
                <div className="p-2 sm:p-3 bg-red-100 dark:bg-red-900/30 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform shrink-0">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-lg sm:text-2xl">pending_actions</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 relative z-10">Remaining to pay</p>
            </div>

            {/* Payment Date */}
            <div className="group bg-white dark:bg-slate-800 rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-300 overflow-hidden relative">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-100 dark:bg-amber-900/20 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-start justify-between mb-2 relative z-10">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Payment Date</p>
                  <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white wrap-break-word">{selectedStudent?.payment_date ? new Date(selectedStudent.payment_date).toLocaleDateString('en-IN') : 'N/A'}</p>
                </div>
                <div className="p-2 sm:p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform shrink-0">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg sm:text-2xl">event</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 relative z-10">Transaction date</p>
            </div>
          </div>

          {/* Payment Progress & Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Progress Bar */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-blue-200 dark:border-blue-800 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm sm:text-base">trending_up</span>
                    Overall Payment Status
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Payment for {selectedMonth}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">{annualStats.paymentPercentage}%</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">collected</p>
                </div>
              </div>
              <div className="h-3 sm:h-4 bg-white dark:bg-slate-800 rounded-full overflow-hidden border border-blue-200 dark:border-blue-700">
                <div 
                  className="h-full bg-linear-to-r from-[#137fec] to-blue-600 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${annualStats.paymentPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Summary Info */}
            <div className="bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-lg sm:rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-md">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2\">
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-sm sm:text-base\">summarize</span>
                {selectedMonth} Summary
              </h3>
              <div className="space-y-2 sm:space-y-3\">
                <div className="flex justify-between items-center p-2 sm:p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700\">
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300\">Total Fee</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-lg\">₹{(selectedStudent?.total_amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700\">
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300\">Amount Paid</span>
                  <span className="font-bold text-green-600 dark:text-green-400 text-sm sm:text-lg\">₹{(selectedStudent?.paid_amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700\">
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300\">Payment Status</span>
                  <span className={`font-bold text-xs sm:text-lg px-2 sm:px-3 py-1 rounded-full ${
                    selectedStudent?.status === 'paid'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : selectedStudent?.status === 'partial'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {selectedStudent?.status === 'paid' ? '✓ PAID' : selectedStudent?.status === 'partial' ? '⚠ PARTIAL' : '⌛ PENDING'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default FeesDashboard
