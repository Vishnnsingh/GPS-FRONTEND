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
    <div className="app-shell min-h-screen flex items-center justify-center px-4">
      <div className="ryme-card w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-white">Access denied</h2>
        <p className="mt-2 text-sm text-slate-300">Your account does not have permission to view this page.</p>
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
    success: 'bg-emerald-400/15 border-emerald-300/40 text-emerald-100',
    error: 'bg-red-400/15 border-red-300/40 text-red-100',
    warning: 'bg-amber-400/15 border-amber-300/40 text-amber-100',
    info: 'bg-cyan-400/15 border-cyan-300/40 text-cyan-100',
  }

  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2 w-[92vw] max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`border rounded-xl shadow-md px-4 py-3 backdrop-blur-md ${typeStyles[toast.type] || typeStyles.info}`}
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
