import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Layout from './Components/Layout'
import StudentRegister from './Pages/Register/StudentRegister'
import StudentLogin from './Pages/Auth/StudentLogin'
import AllLogin from './Pages/Auth/AllLogin'
import Dashboard from './Pages/AllDashboard/AllDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AllLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/register" element={<StudentRegister />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
