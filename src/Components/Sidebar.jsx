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

  // Role-based menu items
  const menuConfig = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'student', label: 'Student', icon: 'person_add' },
      { id: 'studentLifecycle', label: 'Leave/Rejoin', icon: 'sync_alt' },
      { id: 'classPromotion', label: 'Class Promotion', icon: 'arrow_upward' },
      { id: 'subject', label: 'Subject', icon: 'book' },
      { id: 'fees', label: 'Fees', icon: 'payments' },
      { id: 'uploadMarks', label: 'Marks Upload', icon: 'upload' },
      { id: 'uploadPhoto', label: 'Upload Photo', icon: 'photo_camera' }
    ],
    teacher: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'studentLifecycle', label: 'Leave/Rejoin', icon: 'sync_alt' },
      { id: 'uploadMarks', label: 'Marks Upload', icon: 'upload' },
      { id: 'uploadPhoto', label: 'Upload Photo', icon: 'photo_camera' }
    ],
    student: [
      { id: 'result', label: 'Result View', icon: 'assessment' },
      { id: 'profile', label: 'Profile', icon: 'person' }
    ],
    public: [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'about', label: 'About', icon: 'info' },
      { id: 'contact', label: 'Contact', icon: 'call' }
    ]
  }

  // Determine role
  let role = 'public'
  if (loginType === 'student') role = 'student'
  else if (user?.role === 'admin') role = 'admin'
  else if (user?.role === 'teacher') role = 'teacher'

  const menuItems = menuConfig[role]

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
          style={{ touchAction: 'manipulation' }}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static top-0 left-0 bottom-0 lg:top-auto lg:bottom-auto h-full lg:h-full bg-white dark:bg-[#101922] border-r border-slate-200 dark:border-slate-700 shadow-lg lg:shadow-none z-50 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} w-4/5 max-w-xs lg:max-w-none`}
        style={{ fontFamily: "'Lexend', sans-serif" }}
      >
        <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-r-none lg:rounded-none shadow-xl lg:shadow-none overflow-hidden">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-1">
              {/* Desktop Toggle Button */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title={sidebarCollapsed ? 'Expand' : 'Collapse'}
              >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-lg">
                  {sidebarCollapsed ? 'menu_open' : 'menu'}
                </span>
              </button>
              {/* Mobile Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-lg">close</span>
              </button>
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 lg:hidden truncate">Menu</span>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto min-h-0">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'classPromotion') {
                    navigate('/admin/class-promotion')
                  }
                  setActiveView(item.id)
                  setIsOpen(false) // Close sidebar on mobile after selection
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  sidebarCollapsed ? 'justify-center' : ''
                } ${
                  activeView === item.id
                    ? 'bg-[#137fec] text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title={sidebarCollapsed ? item.label : ''}
                style={{ fontSize: '14px' }}
              >
                <span className="material-symbols-outlined text-lg flex-shrink-0">
                  {item.icon}
                </span>
                {!sidebarCollapsed && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout Button at Bottom */}
          <div className="p-2 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
              title={sidebarCollapsed ? 'Logout' : ''}
            >
              {isLoggingOut ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin flex-shrink-0">sync</span>
                  {!sidebarCollapsed && (
                    <span className="font-medium text-xs">Logging out...</span>
                  )}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg flex-shrink-0">logout</span>
                  {!sidebarCollapsed && (
                    <span className="font-medium text-xs">Logout</span>
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
