"use client"

import { useAuth } from "../context/AuthContext"

const LoginButton = ({ className = "", children = "Iniciar Sesión" }) => {
  const { login, loading } = useAuth()

  return (
    <button
      onClick={() => login()}
      disabled={loading}
      className={`flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Iniciando...
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export default LoginButton
