"use client"

import { createContext, useContext, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { useAuth0Profile } from "../hooks/useAuth0Profile"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const { loginWithRedirect, logout: auth0Logout, isLoading: auth0Loading, error } = useAuth0()

  const { user, isAuthenticated, loading: profileLoading } = useAuth0Profile()
  const [updating, setUpdating] = useState(false)

  const login = async (options = {}) => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: "login",
          ...options,
        },
      })
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const signup = async (options = {}) => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: "signup",
          ...options,
        },
      })
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  }

   // 🔹 Update user profile (usa tu servicio)
  const updateProfile = async (formData) => {
    if (!user?.sub) throw new Error("User not authenticated")

    setUpdating(true)
    try {
      // separa datos básicos de metadata
      const { name, phone, vehiclePlate, vehicleModel, vehicleColor } = formData

      const payload = {
        name, // actualiza el nombre directamente en Auth0
        user_metadata: {
          phone,
          vehicle: {
            plate: vehiclePlate,
            model: vehicleModel,
            color: vehicleColor,
          },
        },
      }

      const updatedUser = await Auth0ApiService.updateUser(user.sub, payload)
      return updatedUser
    } catch (err) {
      console.error("Error updating profile:", err)
      throw err
    } finally {
      setUpdating(false)
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading: auth0Loading || profileLoading,
    updating,
    error,
    login,
    signup,
    logout,
    updateProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
