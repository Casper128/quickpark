// Servicio para interactuar con Auth0 Management API
class Auth0ApiService {
  constructor() {
    this.domain = import.meta.env.NEXT_PUBLIC_AUTH0_DOMAIN
    this.clientId = import.meta.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
    this.clientSecret = import.meta.env.NEXT_PUBLIC_AUTH0_AUDIENCE
    this.audience = `https://${this.domain}/api/v2/`
    this.accessToken = null
  }

  async getManagementToken() {
    if (this.accessToken) return this.accessToken

    try {
      const response = await fetch(`https://${this.domain}/oauth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          audience: this.audience,
          grant_type: "client_credentials",
        }),
      })

      const data = await response.json()
      this.accessToken = data.access_token
      return this.accessToken
    } catch (error) {
      console.error("Error getting management token:", error)
      throw error
    }
  }

  async updateUserMetadata(userId, metadata) {
    try {
      const token = await this.getManagementToken()

      const response = await fetch(`https://${this.domain}/api/v2/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_metadata: metadata,
        }),
      })

      return await response.json()
    } catch (error) {
      console.error("Error updating user metadata:", error)
      throw error
    }
  }

  async assignUserRole(userId, roleId) {
    try {
      const token = await this.getManagementToken()

      const response = await fetch(`https://${this.domain}/api/v2/users/${userId}/roles`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roles: [roleId],
        }),
      })

      return await response.json()
    } catch (error) {
      console.error("Error assigning user role:", error)
      throw error
    }
  }

  async getUsersByRole(roleId) {
    try {
      const token = await this.getManagementToken()

      const response = await fetch(`https://${this.domain}/api/v2/roles/${roleId}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return await response.json()
    } catch (error) {
      console.error("Error getting users by role:", error)
      throw error
    }
  }

  async updateUser(userId, data) {
    try {
      const token = await this.getManagementToken()

      const response = await fetch(`https://${this.domain}/api/v2/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Error updating user: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  }
}

export default new Auth0ApiService()
