"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Lock, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth/auth-provider"

export function LoginForm() {
  const [authError, setAuthError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuth()
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    if (auth) {
      setIsAuthReady(true)
    } else {
      setAuthError("Authentication system is initializing. Please try again in a moment.")
    }
  }, [auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!isAuthReady) {
      setError("Authentication system is not ready. Please try again.")
      return
    }

    setIsLoading(true)

    try {
      const success = await auth.login(email, password)
      if (!success) {
        setError("Invalid email or password. Please try again.")
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="font-bold text-2xl flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded">
              <Shield className="h-6 w-6" />
            </div>
            <span>Security</span>
            <span className="text-primary">Vote</span>
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        <CardDescription className="text-center">Access the SecurityVote platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {authError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm">
              Remember me
            </Label>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Lock className="h-3 w-3" />
            <span>Secure Government Access</span>
          </div>
          <p>This is a secure system for authorized personnel only.</p>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-4 text-center">
          <p className="font-medium mb-1">Example Credentials for Testing:</p>
          <p>
            <strong>Admin:</strong> admin@securegovai.org / admin123
          </p>
          <p>
            <strong>User:</strong> user@example.com / user123
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}

