"use client"

import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"
import LoginButton from "../components/LoginButton"
import SignupButton from "../components/SignupButton"
import LoadingSpinner from "../components/LoadingSpinner"

const Login = () => {
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir
    if (isAuthenticated) {
      window.location.href = "/"
    }
  }, [isAuthenticated])

  if (loading) {
    return <LoadingSpinner message="Verificando autenticación..." />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🅿️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">QuickPark</h2>
            <p className="text-gray-600 mb-8">Sistema de Reserva de Parqueaderos</p>
          </div>

          <div className="space-y-4">
            <LoginButton className="w-full" />
            <SignupButton className="w-full" />
          </div>

          <div className="mt-8 text-center">
            <div className="text-sm text-gray-600 mb-4">Características del sistema:</div>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="bg-gray-50 p-2 rounded">✅ Reservas en tiempo real</div>
              <div className="bg-gray-50 p-2 rounded">✅ Pagos seguros integrados</div>
              <div className="bg-gray-50 p-2 rounded">✅ Gestión completa de parqueaderos</div>
              <div className="bg-gray-50 p-2 rounded">✅ Panel administrativo avanzado</div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">Autenticación segura proporcionada por Auth0</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
