"use client"

import { createContext, useContext, useState } from "react"
import Auth0UsersService from "../services/auth0-users"

const UsersContext = createContext()

export const useUsers = () => {
    const context = useContext(UsersContext)
    if (!context) {
        throw new Error("useUsers must be used within a UsersProvider")
    }
    return context
}

export const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // CREATE
    const createUser = async (newUserData) => {
        setLoading(true)
        try {
            const created = await Auth0UsersService.createUser(newUserData)
            setUsers((prev) => [...prev, created])
            return created
        } catch (err) {
            console.error("Error creating user:", err)
            setError(err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    // READ (all)
    const fetchUsers = async () => {
        setLoading(true)
        try {
            const result = await Auth0UsersService.getUsers()
            setUsers(result)
            return result
        } catch (err) {
            console.error("Error fetching users:", err)
            setError(err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    // READ (single)
    const getUserById = async (user) => {
        try {
            return await Auth0UsersService.getUser(user)
        } catch (err) {
            console.error("Error fetching user:", err)
            throw err
        }
    }

    // UPDATE
    const updateUser = async (userId, payload) => {
        setLoading(true)
        try {
            const updated = await Auth0UsersService.updateUser(userId, payload)
            setUsers((prev) =>
                prev.map((u) => (u.user_id === userId ? updated : u))
            )
            return updated
        } catch (err) {
            console.error("Error updating user:", err)
            setError(err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    // DELETE
    const deleteUser = async (userId) => {
        setLoading(true)
        try {
            await Auth0UsersService.deleteUser(userId)
            setUsers((prev) => prev.filter((u) => u.user_id !== userId))
        } catch (err) {
            console.error("Error deleting user:", err)
            setError(err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const value = {
        users,
        loading,
        error,
        createUser,
        fetchUsers,
        getUserById,
        updateUser,
        deleteUser,
    }

    return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
}
