"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  email: string
  role: "admin" | "user" | "auditor" | "approver"
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
    const storedUser = localStorage.getItem("securityvote_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        // Handle invalid JSON
        localStorage.removeItem("securityvote_user")
      }
    }
    setIsLoading(false)
  }, [isBrowser])

  useEffect(() => {
    // Only run this in the browser
    if (!isBrowser || isLoading) return

    // Simple route protection
    if (!user && pathname !== "/" && !pathname.includes("_next")) {
      // Redirect to login if not logged in
      router.push("/")
    } else if (user) {
      // Redirect to appropriate dashboard if on login page
      if (pathname === "/") {
        if (user.role === "admin") {
          router.push("/dashboard")
        } else if (user.role === "auditor") {
          router.push("/auditor")
        } else if (user.role === "approver") {
          router.push("/approver")
        } else {
          router.push("/user")
        }
      }

      // Prevent users from accessing admin routes
      if (
        user.role === "user" &&
        (pathname.startsWith("/dashboard") || pathname.startsWith("/auditor") || pathname.startsWith("/approver"))
      ) {
        router.push("/user")
      }

      // Prevent admins from accessing user routes
      if (user.role === "admin" && pathname.startsWith("/user")) {
        router.push("/dashboard")
      }

      // Prevent auditors from accessing other role routes
      if (
        user.role === "auditor" &&
        (pathname.startsWith("/dashboard") || pathname.startsWith("/approver") || pathname.startsWith("/user"))
      ) {
        router.push("/auditor")
      }

      // Prevent approvers from accessing other role routes
      if (
        user.role === "approver" &&
        (pathname.startsWith("/dashboard") || pathname.startsWith("/auditor") || pathname.startsWith("/user"))
      ) {
        router.push("/approver")
      }
    }
  }, [user, isLoading, pathname, router, isBrowser])

  const login = async (email: string, password: string) => {
    // This would be an API call in a real application
    setIsLoading(true)

    // Example credentials for testing
    const CREDENTIALS = {
      admin: {
        email: "admin@securityvote.org",
        password: "admin123",
        role: "admin",
        name: "Admin User",
      },
      auditor: {
        email: "auditor@securityvote.org",
        password: "auditor123",
        role: "auditor",
        name: "Auditor User",
      },
      approver: {
        email: "intl@securityvote.org",
        password: "intl123",
        role: "approver",
        name: "International Observer",
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
          localStorage.setItem("securityvote_user", JSON.stringify(userData))
          setIsLoading(false)
          resolve(true)
        } else if (email === CREDENTIALS.auditor.email && password === CREDENTIALS.auditor.password) {
          const userData = {
            email: email,
            role: "auditor" as const,
            name: CREDENTIALS.auditor.name,
          }
          setUser(userData)
          localStorage.setItem("securityvote_user", JSON.stringify(userData))
          setIsLoading(false)
          resolve(true)
        } else if (email === CREDENTIALS.approver.email && password === CREDENTIALS.approver.password) {
          const userData = {
            email: email,
            role: "approver" as const,
            name: CREDENTIALS.approver.name,
          }
          setUser(userData)
          localStorage.setItem("securityvote_user", JSON.stringify(userData))
          setIsLoading(false)
          resolve(true)
        } else if (email === CREDENTIALS.user.email && password === CREDENTIALS.user.password) {
          const userData = {
            email: email,
            role: "user" as const,
            name: CREDENTIALS.user.name,
          }
          setUser(userData)
          localStorage.setItem("securityvote_user", JSON.stringify(userData))
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
    localStorage.removeItem("securityvote_user")
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

