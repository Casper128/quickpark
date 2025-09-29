"use client"

import { useAuth } from "../context/AuthContext"

const LogoutButton = ({ className = "", children = "Cerrar Sesión" }) => {
  const { logout } = useAuth()

  return (
    <button
      onClick={() => logout()}
      className={`px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

export default LogoutButton
