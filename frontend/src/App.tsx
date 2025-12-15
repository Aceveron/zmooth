import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Landing from './app/Landing'
import Login from './app/Login'
import { SuperDashboard } from './components/super/dashboard'
import AdminList from './app/super/admin-list'
import ActivityLogs from './app/super/logs'
import NotificationsCenter from './app/super/notifications'

function App() {
  function ProtectedSuper({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    if (loading) return <div />
    if (!user || user?.role !== 'super') return <Navigate to="/login" />
    return children
  }
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/super-admin"
            element={
              <ProtectedSuper>
                <SuperDashboard />
              </ProtectedSuper>
            }
          />
          <Route
            path="/super-admin/admin-list"
            element={
              <ProtectedSuper>
                <AdminList />
              </ProtectedSuper>
            }
          />
          <Route
            path="/super-admin/logs"
            element={
              <ProtectedSuper>
                <ActivityLogs />
              </ProtectedSuper>
            }
          />
          <Route
            path="/super-admin/notifications"
            element={
              <ProtectedSuper>
                <NotificationsCenter />
              </ProtectedSuper>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
