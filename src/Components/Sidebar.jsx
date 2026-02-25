import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSession, getLoginType, getUser, logout } from '../Api/auth'

function Sidebar({ isOpen, setIsOpen, activeView, setActiveView, sidebarCollapsed, setSidebarCollapsed }) {
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [loginType, setLoginType] = useState('all')
  const [user, setUser] = useState(null)

  useEffect(() => {
    setLoginType(getLoginType())
    setUser(getUser())
  }, [])

  const menuConfig = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'student', label: 'Student', icon: 'person_add' },
      { id: 'studentLifecycle', label: 'Leave/Rejoin', icon: 'sync_alt' },
      { id: 'classPromotion', label: 'Class Promotion', icon: 'arrow_upward' },
      { id: 'subject', label: 'Subject', icon: 'book' },
      { id: 'teachers', label: 'Teachers', icon: 'groups' },
      { id: 'fees', label: 'Fees', icon: 'payments' },
      { id: 'uploadMarks', label: 'Marks Upload', icon: 'upload' },
      { id: 'uploadPhoto', label: 'Upload Photo', icon: 'photo_camera' },
    ],
    teacher: [{ id: 'uploadMarks', label: 'Marks Upload', icon: 'upload' }],
    student: [
      { id: 'result', label: 'Result View', icon: 'assessment' },
      { id: 'profile', label: 'Profile', icon: 'person' },
    ],
    public: [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'about', label: 'About', icon: 'info' },
      { id: 'contact', label: 'Contact', icon: 'call' },
    ],
  }

  let role = 'public'
  if (loginType === 'student') role = 'student'
  else if (user?.role === 'admin') role = 'admin'
  else if (user?.role === 'teacher') role = 'teacher'

  const menuItems = menuConfig[role]
  const collapsedDesktopOnly = sidebarCollapsed

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const currentLoginType = getLoginType()

    try {
      if (currentLoginType === 'all') await logout()
      else clearSession()
    } catch (error) {
      console.error('Logout error:', error)
      clearSession()
    } finally {
      clearSession()
      if (currentLoginType === 'student') navigate('/student-login')
      else navigate('/login')
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[1px] lg:hidden"
          onClick={() => setIsOpen(false)}
          style={{ touchAction: 'manipulation' }}
        ></div>
      )}

      <aside
        className={`fixed bottom-0 left-0 top-0 z-50 h-full w-4/5 max-w-xs transition-all duration-300 ease-out lg:static lg:h-full lg:max-w-none ${
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-full p-3 sm:p-4">
          <div className="ryme-glass flex h-full flex-col overflow-hidden rounded-2xl border border-cyan-200/25">
            <div className="flex items-center justify-between border-b border-cyan-200/20 px-3 py-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden rounded-lg border border-cyan-200/30 p-1.5 text-cyan-100 hover:bg-cyan-300/10 lg:inline-flex"
                  title={sidebarCollapsed ? 'Expand' : 'Collapse'}
                >
                  <span className="material-symbols-outlined text-base">{sidebarCollapsed ? 'menu_open' : 'menu'}</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-cyan-200/30 p-1.5 text-cyan-100 lg:hidden"
                  aria-label="Close sidebar"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
              <p
                className={`text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/80 ${
                  collapsedDesktopOnly ? 'lg:hidden' : ''
                }`}
              >
                Navigation
              </p>
            </div>

            <nav className="flex-1 overflow-hidden px-2 py-3">
              <div className="sidebar-scroll h-full space-y-1.5 overflow-y-auto overflow-x-hidden pr-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'classPromotion') navigate('/admin/class-promotion')
                      setActiveView(item.id)
                      setIsOpen(false)
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                      collapsedDesktopOnly ? 'lg:justify-center' : ''
                    } ${
                      activeView === item.id
                        ? 'bg-cyan-300 text-[#04213c] shadow-[0_8px_24px_rgba(0,169,245,0.35)]'
                        : 'text-slate-200 hover:bg-cyan-300/10 hover:text-white'
                    }`}
                    title={collapsedDesktopOnly ? item.label : ''}
                  >
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    <span className={`truncate ${collapsedDesktopOnly ? 'lg:hidden' : ''}`}>{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>

            <div className="border-t border-cyan-200/20 p-2.5">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`flex w-full items-center gap-2 rounded-xl border border-red-300/35 bg-red-400/10 px-3 py-2.5 text-sm font-semibold text-red-100 transition-all hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-60 ${
                  collapsedDesktopOnly ? 'lg:justify-center' : ''
                }`}
                title={collapsedDesktopOnly ? 'Logout' : ''}
              >
                <span className={`material-symbols-outlined text-lg ${isLoggingOut ? 'animate-spin' : ''}`}>
                  {isLoggingOut ? 'sync' : 'logout'}
                </span>
                <span className={collapsedDesktopOnly ? 'lg:hidden' : ''}>
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
