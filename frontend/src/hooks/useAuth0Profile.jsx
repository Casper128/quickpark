"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { useState, useEffect } from "react"

export const useAuth0Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserProfile = async () => {
      if (isAuthenticated && user) {
        try {
          // Obtener token de acceso
          const token = await getAccessTokenSilently()

          // Crear perfil de usuario extendido
          const profile = {
            id: user.sub,
            name: user.name || user.nickname,
            email: user.email,
            picture: user.picture,
            role: user["https://quickpark.com/roles"]?.[0] || "user", // Custom claim para roles
            phone: user["https://quickpark.com/phone"] || "",
            vehicle: {
              plate: user["https://quickpark.com/vehicle_plate"] || "",
              model: user["https://quickpark.com/vehicle_model"] || "",
              color: user["https://quickpark.com/vehicle_color"] || "",
            },
            emailVerified: user.email_verified,
            createdAt: user.created_at,
            lastLogin: user.last_login,
            accessToken: token,
          }

          setUserProfile(profile)
        } catch (error) {
          console.error("Error getting user profile:", error)
        }
      }
      setLoading(false)
    }

    getUserProfile()
  }, [isAuthenticated, user, getAccessTokenSilently])

  return {
    user: userProfile,
    isAuthenticated,
    loading,
  }
}
