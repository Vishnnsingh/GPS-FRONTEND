import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Components/Layout'
import StudentRegister from './Pages/Register/StudentRegister'
import StudentLogin from './Pages/Auth/StudentLogin'
import AllLogin from './Pages/Auth/AllLogin'
import Dashboard from './Pages/AllDashboard/AllDashboard'
import ResultLogin from './Pages/Results/ResultLogin'
import Results from './Pages/Results/Results'
import ResultsPortal from './Pages/Results/ResultsPortal'
import Home from './Pages/Website/Home'
import About from './Pages/Website/About'
import Contact from './Pages/Website/Contact'
import Galary from './Pages/Website/Galary'
import { getAccessToken, getUser } from './Api/auth'

function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4" style={{ fontFamily: "'Lexend', sans-serif" }}>
      <div className="w-full max-w-md bg-white border border-amber-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Access denied</h2>
        <p className="mt-2 text-sm text-slate-600">Your account does not have permission to view this page.</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = getAccessToken()
  const user = getUser()
  const loginType = localStorage.getItem('loginType')
  const role = loginType === 'student' ? 'student' : user?.role

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const onToast = (event) => {
      const detail = event?.detail || {}
      const toast = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: detail.type || 'info',
        title: detail.title || '',
        message: detail.message || '',
      }

      setToasts((prev) => [...prev, toast])
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== toast.id))
      }, 4500)
    }

    window.addEventListener('app:toast', onToast)
    return () => window.removeEventListener('app:toast', onToast)
  }, [])

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2 w-[92vw] max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`border rounded-xl shadow-md px-4 py-3 ${typeStyles[toast.type] || typeStyles.info}`}
          style={{ fontFamily: "'Lexend', sans-serif" }}
        >
          {toast.title ? <p className="text-xs font-semibold mb-0.5">{toast.title}</p> : null}
          <p className="text-sm">{toast.message}</p>
        </div>
      ))}
    </div>
  )
}

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Galary />} />
        <Route path="/login" element={<AllLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/result-login" element={<ResultLogin />} />
        <Route path="/results-portal" element={<ResultsPortal />} />
        <Route path="/result" element={<Results />} />
        <Route path="/register" element={<StudentRegister />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          element={
            <ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'accountant']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/class-promotion" element={<Dashboard initialView="classPromotion" />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
