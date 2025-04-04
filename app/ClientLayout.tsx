"use client"

import { AuthProvider } from "@/components/auth/auth-provider"
import { useEffect, useState } from "react"
import type React from "react"

function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // Return a loading state or minimal layout when not mounted yet
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading SecurityVote...</h2>
          <p className="text-sm text-muted-foreground mt-2">Please wait while the system initializes</p>
        </div>
      </div>
    )
  }

  return <AuthProvider>{children}</AuthProvider>
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <ClientAuthProvider>{children}</ClientAuthProvider>
}

