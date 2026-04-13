import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './features/auth/components/Login'
import RoleSelection from './features/auth/components/RoleSelection'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import PublicRoute from './features/auth/components/PublicRoute'
import MainLayout from './components/layout/MainLayout'
import Profile from './pages/Profile'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes with MainLayout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        {/* We can add more protected routes here like /profile, /settings, /orders etc */}
      </Route>

      {/* Specialized Protected Routes (No Layout) */}
      <Route
        path="/select-role"
        element={
          <ProtectedRoute>
            <RoleSelection />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
