"use client"

import { useAuth } from "../context/AuthContext"

const UserProfile = ({ showDetails = false }) => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        {user.picture ? (
          <img src={user.picture || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user.name?.charAt(0) || "U"}
          </div>
        )}
      </div>

      {showDetails && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
          {user.role === "admin" && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Admin
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default UserProfile
