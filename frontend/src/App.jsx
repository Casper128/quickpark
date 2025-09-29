"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import Reservations from "./pages/Reservations"
import ParkingLots from "./pages/ParkingLots"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import AdminDashboard from "./pages/AdminDashboard"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ParkingProvider } from "./context/ParkingContext"
import Auth0ProviderWithHistory from "./auth/auth0-provider"
import AuthenticationGuard from "./components/AuthenticationGuard"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"
import { UsersProvider } from "./context/UserContext"

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/parking-lots" element={<ParkingLots />} />
          <Route path="/profile" element={<Profile />} />
          {user?.role === "admin" && (
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Auth0ProviderWithHistory>
      <AuthenticationGuard>
        <AuthProvider>
          <UsersProvider>
            <ParkingProvider>
              <Router>
                <AppContent />
              </Router>
            </ParkingProvider>
          </UsersProvider>
        </AuthProvider>
      </AuthenticationGuard>
    </Auth0ProviderWithHistory>
  )
}

export default App
