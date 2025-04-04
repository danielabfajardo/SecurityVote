"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  email: string
  role: "admin" | "user"
  name: string
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if we're in a browser environment
  const isBrowser = typeof window !== "undefined"

  useEffect(() => {
    // Only run this in the browser
    if (!isBrowser) return

    // Check if user is logged in
    const storedUser = localStorage.getItem("securegovai_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        // Handle invalid JSON
        localStorage.removeItem("securegovai_user")
      }
    }
    setIsLoading(false)
  }, [isBrowser])

  useEffect(() => {
    // Only run this in the browser
    if (!isBrowser) return

    // Simple route protection
    if (!isLoading) {
      if (!user && pathname !== "/" && !pathname.includes("_next")) {
        // Redirect to login if not logged in
        router.push("/")
      } else if (user) {
        // Redirect to appropriate dashboard if on login page
        if (pathname === "/") {
          if (user.role === "admin") {
            router.push("/dashboard")
          } else {
            router.push("/user")
          }
        }

        // Prevent users from accessing admin routes
        if (user.role === "user" && pathname.startsWith("/dashboard")) {
          router.push("/user")
        }

        // Prevent admins from accessing user routes
        if (user.role === "admin" && pathname.startsWith("/user")) {
          router.push("/dashboard")
        }
      }
    }
  }, [user, isLoading, pathname, router, isBrowser])

  const login = async (email: string, password: string) => {
    // This would be an API call in a real application
    setIsLoading(true)

    // Example credentials for testing
    const CREDENTIALS = {
      admin: {
        email: "admin@securegovai.org",
        password: "admin123",
        role: "admin",
        name: "Admin User",
      },
      user: {
        email: "user@example.com",
        password: "user123",
        role: "user",
        name: "Regular User",
      },
    }

    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        if (email === CREDENTIALS.admin.email && password === CREDENTIALS.admin.password) {
          const userData = {
            email: email,
            role: "admin" as const,
            name: CREDENTIALS.admin.name,
          }
          setUser(userData)
          localStorage.setItem("securegovai_user", JSON.stringify(userData))
          setIsLoading(false)
          resolve(true)
        } else if (email === CREDENTIALS.user.email && password === CREDENTIALS.user.password) {
          const userData = {
            email: email,
            role: "user" as const,
            name: CREDENTIALS.user.name,
          }
          setUser(userData)
          localStorage.setItem("securegovai_user", JSON.stringify(userData))
          setIsLoading(false)
          resolve(true)
        } else {
          setIsLoading(false)
          resolve(false)
        }
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("securegovai_user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

