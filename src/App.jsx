import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import ResumeEditor from './pages/ResumeEditor'
import { ResumeProvider } from './context/ResumeContext'

function App() {
  return (
    <BrowserRouter>
      <ResumeProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/resume" element={<ResumeBuilder />} />
          <Route path="/dashboard/resume/edit" element={<ResumeEditor />} />
        </Routes>
      </ResumeProvider>
    </BrowserRouter>
  )
}

export default App
