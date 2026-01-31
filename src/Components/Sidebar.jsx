import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, clearSession, getLoginType, getUser } from '../Api/auth'

function Sidebar({ isOpen, setIsOpen, activeView, setActiveView, sidebarCollapsed, setSidebarCollapsed }) {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [loginType, setLoginType] = useState('all')
  const [user, setUser] = useState(null)

  useEffect(() => {
    setLoginType(getLoginType())
    setUser(getUser())
  }, [])

  // Dynamic menu items based on login type and user role
  const getMenuItems = () => {
    if (loginType === 'student') {
      // Student login: only Result View
      return [
        { id: 'result', label: 'Result View', icon: 'assessment' }
      ]
    } else {
      // All login (admin/teacher): Dashboard
      const items = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }
      ]
      
      // Add "Student" button only for admin
      if (user?.role === 'admin') {
        items.push({ id: 'student', label: 'Student', icon: 'person_add' })
      }
      
      // Add "Subject" button only for admin
      if (user?.role === 'admin') {
        items.push({ id: 'subject', label: 'Subject', icon: 'book' })
      }
      
      // Add "Marks Upload" button for admin and teacher
      if (user?.role === 'admin' || user?.role === 'teacher') {
        items.push({ id: 'uploadMarks', label: 'Marks Upload', icon: 'upload' })
      }
      
      return items
    }
  }

  const menuItems = getMenuItems()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const currentLoginType = getLoginType()
    
    try {
      // Only call logout API for 'all' login type (admin/teacher)
      // Student logout API will be integrated later
      if (currentLoginType === 'all') {
        await logout()
      } else {
        // For student, just clear session (API will be integrated later)
        clearSession()
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Even if API fails, clear local session
      clearSession()
    } finally {
      // Clear session data
      clearSession()
      
      // Navigate based on login type
      if (currentLoginType === 'student') {
        // Student logout: redirect to student login page
        navigate('/student-login')
      } else {
        // All login logout: redirect to all login page
        navigate('/login')
      }
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static top-0 left-0 h-screen lg:h-full bg-white dark:bg-[#101922] border-r border-slate-200 dark:border-slate-700 shadow-lg lg:shadow-none z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
        style={{ fontFamily: "'Lexend', sans-serif" }}
      >
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-r-lg lg:rounded-none shadow-xl lg:shadow-none overflow-hidden">
          {/* Sidebar Header */}
          <div className="flex items-center justify-end p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-2">
              {/* Desktop Toggle Button */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title={sidebarCollapsed ? 'Expand' : 'Collapse'}
              >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                  {sidebarCollapsed ? 'menu_open' : 'menu'}
                </span>
              </button>
              {/* Mobile Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">close</span>
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id)
                  setIsOpen(false) // Close sidebar on mobile after selection
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                  sidebarCollapsed ? 'justify-center' : ''
                } ${
                  activeView === item.id
                    ? 'bg-[#137fec] text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <span className="material-symbols-outlined text-xl">
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout Button at Bottom */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
              title={sidebarCollapsed ? 'Logout' : ''}
            >
              {isLoggingOut ? (
                <>
                  <span className="material-symbols-outlined text-xl animate-spin">sync</span>
                  {!sidebarCollapsed && (
                    <span className="font-medium text-sm">Logging out...</span>
                  )}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">logout</span>
                  {!sidebarCollapsed && (
                    <span className="font-medium text-sm">Logout</span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
