// Servicio para interactuar con Auth0 Management API
class Auth0UsersService {
    constructor() {
        this.domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
        this.clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
        this.clientSecret = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE
        this.audience = `https://${this.domain}/api/v2/`
        this.accessToken = null
    }

    // 🔑 Obtener Management Token
    async getManagementToken() {
        if (this.accessToken) return this.accessToken

        try {
            const response = await fetch(`https://${this.domain}/oauth/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    audience: this.audience,
                    grant_type: "client_credentials",
                }),
            })
            debugger;
            const data = await response.json()
            this.accessToken = data.access_token
            return this.accessToken
        } catch (error) {
            console.error("Error getting management token:", error)
            throw error
        }
    }

    // 🟢 CREATE user
    async createUser(userData) {
        try {
            const token = await this.getManagementToken()

            const response = await fetch(`https://${this.domain}/api/v2/users`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData), // email, password, connection, name, etc.
            })

            if (!response.ok) throw new Error(`Error creating user: ${response.statusText}`)
            return await response.json()
        } catch (error) {
            console.error("Error creating user:", error)
            throw error
        }
    }

    // 🔍 READ all users
    async getUsers() {
        try {
            const token = await this.getManagementToken()

            const response = await fetch(`https://${this.domain}/api/v2/users`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!response.ok) throw new Error(`Error fetching users: ${response.statusText}`)
            return await response.json()
        } catch (error) {
            console.error("Error fetching users:", error)
            throw error
        }
    }

    // 🔍 READ single user
    async getUser(user) {
        const { id } = user

        const token = await this.getManagementToken()
        
        try {

            const response = await fetch(`https://${this.domain}/api/v2/users/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            if (!response.ok) throw new Error(`Error fetching user: ${response.statusText}`)
            return await response.json()
        } catch (error) {
            console.error("Error fetching user:", error)
            throw error
        }
    }

    // ✏️ UPDATE user (datos generales o metadata)
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

            if (!response.ok) throw new Error(`Error updating user: ${response.statusText}`)
            return await response.json()
        } catch (error) {
            console.error("Error updating user:", error)
            throw error
        }
    }

    // ❌ DELETE user
    async deleteUser(userId) {
        try {
            const token = await this.getManagementToken()

            const response = await fetch(`https://${this.domain}/api/v2/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!response.ok) throw new Error(`Error deleting user: ${response.statusText}`)
            return true
        } catch (error) {
            console.error("Error deleting user:", error)
            throw error
        }
    }

    async getUsersByRole(roleId) {
        try {
            const token = await this.getManagementToken()

            const response = await fetch(`https://${this.domain}/api/v2/roles/${roleId}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!response.ok) throw new Error(`Error getting users by role: ${response.statusText}`)
            return await response.json()
        } catch (error) {
            console.error("Error getting users by role:", error)
            throw error
        }
    }
}

export default new Auth0UsersService()
