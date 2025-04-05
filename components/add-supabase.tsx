"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function AddSupabase() {
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [isConfigured, setIsConfigured] = useState(false)

  const handleSave = () => {
    // In a real app, you would store these securely
    localStorage.setItem("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl)
    localStorage.setItem("NEXT_PUBLIC_SUPABASE_ANON_KEY", supabaseKey)
    setIsConfigured(true)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Configure Supabase</CardTitle>
        <CardDescription>Enter your Supabase credentials to enable database functionality</CardDescription>
      </CardHeader>
      <CardContent>
        {isConfigured ? (
          <div className="bg-green-50 p-4 rounded-md text-green-700">
            <p className="font-medium">Supabase configured successfully!</p>
            <p className="text-sm mt-1">You can now use the database features of the application.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supabase-url">Supabase URL</Label>
              <Input
                id="supabase-url"
                placeholder="https://your-project.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supabase-key">Supabase Anon Key</Label>
              <Input
                id="supabase-key"
                placeholder="your-anon-key"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isConfigured && (
          <Button onClick={handleSave} className="w-full">
            Save Configuration
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

