"use client"

import { useAuth0 } from "@auth0/auth0-react"
import LoadingSpinner from "./LoadingSpinner"

const AuthenticationGuard = ({ children }) => {
  const { isLoading, error } = useAuth0()

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error de Autenticación</h2>
          <p className="text-red-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return children
}

export default AuthenticationGuard
