import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import ResumeBuilder from './pages/ResumeBuilder'
import ResumeEditor from './pages/ResumeEditor'
import { ResumeProvider } from './context/ResumeContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ResumeProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/resume"
              element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/resume/new"
              element={
                <ProtectedRoute>
                  <ResumeEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/resume/edit"
              element={
                <ProtectedRoute>
                  <ResumeEditor />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
