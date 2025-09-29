"use client"

import { useAuth } from "../context/AuthContext"

const SignupButton = ({ className = "", children = "Registrarse" }) => {
  const { signup, loading } = useAuth()

  return (
    <button
      onClick={() => signup()}
      disabled={loading}
      className={`flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          Registrando...
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export default SignupButton
