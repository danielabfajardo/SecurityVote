"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"

type UserData = {
  name: string
  email: string
  role?: string
}

export function useAuthState() {
  const [mounted, setMounted] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)

  // Use auth hook unconditionally
  const auth = useAuth()
  const user = auth?.user

  // Safe access to auth context after component is mounted
  useEffect(() => {
    setMounted(true)

    // Try to get user data from localStorage as fallback
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("securityvote_user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUserData({
            name: parsedUser.name,
            email: parsedUser.email,
            role: parsedUser.role,
          })
        }
      } catch (e) {
        console.error("Failed to parse user data from localStorage")
      }
    }
  }, [])

  // Update user data if auth becomes available
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name,
        email: user.email,
        role: user.role,
      })
    }
  }, [user])

  const logout = () => {
    if (auth) {
      auth.logout()
    } else {
      // Fallback logout if auth context isn't available
      if (typeof window !== "undefined") {
        localStorage.removeItem("securityvote_user")
        window.location.href = "/"
      }
    }
  }

  return {
    user: userData,
    isAuthenticated: !!userData,
    isLoading: !mounted || auth?.isLoading,
    logout,
  }
}

