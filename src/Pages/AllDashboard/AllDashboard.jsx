import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../Components/Sidebar'
import ResultView from '../../Components/ResultView/ResultView'
import Student from './Student'
import Subject from './Subject'
import UploadMarks from './UploadMarks'
import UploadPhoto from '../../Components/UploadPhoto/UploadPhoto'
import { getUser, getLoginType } from '../../Api/auth'
import { getAllStudents } from '../../Api/students'
import { getAllSubjects } from '../../Api/subjects'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

function Dashboard() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeView, setActiveView] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [loginType, setLoginType] = useState('all')
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalSubjects: 0,
    studentsByClass: [],
    studentsBySection: [],
    subjectsPerClass: [],
    loading: true
  })

  useEffect(() => {
    const currentUser = getUser()
    const loginTypeFromStorage = getLoginType()
    
    if (!currentUser) {
      navigate('/login')
    } else {
      setUser(currentUser)
      setLoginType(loginTypeFromStorage)
      
      // Set initial view based on login type
      if (loginTypeFromStorage === 'student') {
        setActiveView('result')
      } else {
        setActiveView('dashboard')
      }
    }
  }, [navigate])

  useEffect(() => {
    if (loginType !== 'student' && activeView === 'dashboard') {
      fetchDashboardData()
    }
  }, [loginType, activeView])

  const fetchDashboardData = async () => {
    setDashboardData(prev => ({ ...prev, loading: true }))
    try {
      // Fetch students data
      const studentsResponse = await getAllStudents()
      const students = studentsResponse?.students || []
      const totalStudents = students.length || studentsResponse?.count || 0

      // Calculate students by class
      const classDistribution = {}
      const sectionDistribution = {}
      
      students.forEach(student => {
        const className = student.Class || student.class || 'Unknown'
        const section = student.Section || student.section || 'No Section'
        
        classDistribution[className] = (classDistribution[className] || 0) + 1
        sectionDistribution[section] = (sectionDistribution[section] || 0) + 1
      })

      const studentsByClass = Object.entries(classDistribution)
        .map(([name, value]) => ({ name: `Class ${name}`, value }))
        .sort((a, b) => {
          const numA = parseInt(a.name.replace('Class ', '')) || 999
          const numB = parseInt(b.name.replace('Class ', '')) || 999
          return numA - numB
        })

      const studentsBySection = Object.entries(sectionDistribution)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => a.name.localeCompare(b.name))

      // Fetch subjects data
      const subjectsResponse = await getAllSubjects()
      const totalClasses = subjectsResponse?.summary?.total_classes || 0
      const totalSubjects = subjectsResponse?.summary?.total_unique_subjects || 0
      
      // Calculate subjects per class
      const subjectsPerClass = []
      if (subjectsResponse?.summary?.subjects_per_class) {
        subjectsResponse.summary.subjects_per_class.forEach(item => {
          subjectsPerClass.push({
            name: `Class ${item.class}`,
            subjects: item.subjects_count,
            sections: item.sections_count
          })
        })
      } else if (subjectsResponse?.classes) {
        subjectsResponse.classes.forEach(cls => {
          subjectsPerClass.push({
            name: `Class ${cls.class}`,
            subjects: cls.total_subjects || 0,
            sections: cls.total_sections || 0
          })
        })
      }

      setDashboardData({
        totalStudents,
        totalClasses,
        totalSubjects,
        studentsByClass,
        studentsBySection,
        subjectsPerClass,
        loading: false
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setDashboardData(prev => ({ ...prev, loading: false }))
    }
  }

  return (
    <>
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        activeView={activeView}
        setActiveView={setActiveView}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed top-4 left-4 z-30 bg-[#137fec] text-white p-2 rounded-lg shadow-lg hover:bg-[#137fec]/90 transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="p-4 lg:p-6">
            {loginType !== 'student' && activeView === 'dashboard' && (
              <div className="space-y-4" style={{ fontFamily: "'Lexend', sans-serif" }}>
                <h2 className="text-2xl font-black text-[#0d141b] dark:text-white">Dashboard</h2>
                
                {/* Dashboard Cards */}
                {dashboardData.loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-center py-8">
                          <span className="material-symbols-outlined animate-spin text-3xl text-[#137fec]">sync</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Total Students */}
                    <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Students</span>
                        <div className="w-10 h-10 rounded-lg bg-[#137fec]/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#137fec] text-lg">people</span>
                        </div>
                      </div>
                      <p className="text-3xl font-black text-slate-900 dark:text-white">{dashboardData.totalStudents}</p>
                    </div>

                    {/* Total Classes */}
                    <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Classes</span>
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-green-500 text-lg">class</span>
                        </div>
                      </div>
                      <p className="text-3xl font-black text-slate-900 dark:text-white">{dashboardData.totalClasses}</p>
                    </div>

                    {/* Total Subjects */}
                    <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Subjects</span>
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-purple-500 text-lg">book</span>
                        </div>
                      </div>
                      <p className="text-3xl font-black text-slate-900 dark:text-white">{dashboardData.totalSubjects}</p>
                    </div>
                  </div>
                )}

                {/* Analytics Section */}
                {!dashboardData.loading && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Students Distribution by Class */}
                    {dashboardData.studentsByClass.length > 0 && (
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Students Distribution by Class</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={dashboardData.studentsByClass}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="name" 
                              angle={-45} 
                              textAnchor="end" 
                              height={80}
                              style={{ fontSize: 11 }}
                            />
                            <YAxis style={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#137fec" name="Students" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Students Distribution by Section */}
                    {dashboardData.studentsBySection.length > 0 && (
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Students Distribution by Section</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={dashboardData.studentsBySection}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {dashboardData.studentsBySection.map((entry, index) => {
                                const colors = ['#137fec', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
                                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                              })}
                            </Pie>
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Subjects per Class */}
                    {dashboardData.subjectsPerClass.length > 0 && (
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 lg:col-span-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Subjects & Sections per Class</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={dashboardData.subjectsPerClass}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="name" 
                              angle={-45} 
                              textAnchor="end" 
                              height={80}
                              style={{ fontSize: 11 }}
                            />
                            <YAxis style={{ fontSize: 11 }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Bar dataKey="subjects" fill="#137fec" name="Subjects" />
                            <Bar dataKey="sections" fill="#10b981" name="Sections" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Average Students per Class</p>
                            <p className="text-2xl font-black text-blue-900 dark:text-blue-100">
                              {dashboardData.totalClasses > 0 
                                ? Math.round(dashboardData.totalStudents / dashboardData.totalClasses) 
                                : 0}
                            </p>
                          </div>
                          <span className="material-symbols-outlined text-blue-500 text-3xl">trending_up</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Average Subjects per Class</p>
                            <p className="text-2xl font-black text-green-900 dark:text-green-100">
                              {dashboardData.totalClasses > 0 
                                ? Math.round(dashboardData.subjectsPerClass.reduce((sum, item) => sum + item.subjects, 0) / dashboardData.totalClasses) 
                                : 0}
                            </p>
                          </div>
                          <span className="material-symbols-outlined text-green-500 text-3xl">book</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Total Sections</p>
                            <p className="text-2xl font-black text-purple-900 dark:text-purple-100">
                              {dashboardData.subjectsPerClass.reduce((sum, item) => sum + item.sections, 0)}
                            </p>
                          </div>
                          <span className="material-symbols-outlined text-purple-500 text-3xl">category</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">Subject Coverage</p>
                            <p className="text-2xl font-black text-orange-900 dark:text-orange-100">
                              {dashboardData.totalClasses > 0 
                                ? `${Math.round((dashboardData.totalSubjects / dashboardData.totalClasses) * 10)}%`
                                : '0%'}
                            </p>
                          </div>
                          <span className="material-symbols-outlined text-orange-500 text-3xl">analytics</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(loginType === 'student' || activeView === 'result') && <ResultView />}
            
            {activeView === 'student' && <Student />}
            
            {activeView === 'subject' && <Subject />}
            
            {activeView === 'uploadMarks' && <UploadMarks />}

            {activeView === 'uploadPhoto' && <UploadPhoto />}
          </div>
        </main>
    </>
  )
}

export default Dashboard


