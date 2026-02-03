import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
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

function App() {
  return (
    <Router>
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
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
