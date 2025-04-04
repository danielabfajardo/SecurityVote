"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Clock, FileText, Search, Shield, XCircle, Phone } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useWhistleblowerReport } from "@/hooks/use-data"
import { DataLoader } from "@/components/ui/data-loader"
import { useSearchParams } from "next/navigation"

export function ReportTracking() {
  const [trackingId, setTrackingId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const searchParams = useSearchParams()

  // Check if there's a tracking ID in the URL
  useEffect(() => {
    const idFromUrl = searchParams.get("id")
    if (idFromUrl) {
      setTrackingId(idFromUrl)
    }
  }, [searchParams])

  // Fetch report data based on tracking ID
  const { data: report, isLoading: isLoadingReport, error: reportError } = useWhistleblowerReport(trackingId || null)

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!trackingId) {
      setError("Please enter a tracking ID")
      return
    }

    // The actual fetching is handled by the useWhistleblowerReport hook
    setIsLoading(true)

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  // Mock updates data - in a real app, this would come from the database
  const mockUpdates = [
    {
      date: "2023-09-15",
      status: "received",
      message: "Report received and assigned for initial review.",
    },
    {
      date: "2023-09-16",
      status: "reviewing",
      message: "Initial assessment completed. Report contains sufficient information to proceed with investigation.",
    },
    {
      date: "2023-09-18",
      status: "investigating",
      message: "Investigation initiated. Team assigned to verify contract details and company ownership.",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Track Your Report</CardTitle>
          <CardDescription>Enter your tracking ID to check the status of your whistleblower report</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="tracking-id">Tracking ID</Label>
              <div className="flex space-x-2">
                <Input
                  id="tracking-id"
                  placeholder="e.g., WB-7829"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  required
                />
                <Button type="submit" disabled={isLoading || isLoadingReport}>
                  {isLoading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  Track
                </Button>
              </div>
              {error && <p className="text-sm text-destructive mt-2">{error}</p>}
              {reportError && <p className="text-sm text-destructive mt-2">{reportError.message}</p>}
            </div>
          </form>

          <DataLoader isLoading={isLoadingReport} error={null} data={report}>
            {(reportData) => (
              <div className="mt-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Report Details</h3>
                  <Badge
                    variant="outline"
                    className={
                      reportData.status === "verified"
                        ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                        : reportData.status === "investigating"
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                          : "bg-red-50 text-red-700 hover:bg-red-50 border-red-200"
                    }
                  >
                    {reportData.status === "verified" ? (
                      <>
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
                      </>
                    ) : reportData.status === "investigating" ? (
                      <>
                        <Clock className="mr-1 h-3 w-3" /> Investigating
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-1 h-3 w-3" /> Unverified
                      </>
                    )}
                  </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tracking ID</p>
                    <p className="font-medium">{reportData.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Submission Date</p>
                    <p className="font-medium">{new Date(reportData.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium capitalize">{reportData.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Agency</p>
                    <p className="font-medium">{reportData.agency}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Report Title</p>
                  <p className="font-medium">{reportData.title}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{reportData.description}</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Investigation Timeline</h4>
                  <div className="space-y-4">
                    {mockUpdates.map((update, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div
                          className={`rounded-full p-1.5 ${
                            update.status === "received"
                              ? "bg-blue-100 text-blue-700"
                              : update.status === "reviewing"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {update.status === "received" ? (
                            <FileText className="h-3 w-3" />
                          ) : update.status === "reviewing" ? (
                            <Search className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium capitalize">{update.status}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3" />
                              {update.date}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{update.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DataLoader>

          {!report && !error && !isLoadingReport && (
            <div className="mt-8 flex flex-col items-center justify-center py-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Enter your tracking ID</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Use the tracking ID you received after submitting your report
              </p>
              <p className="text-xs text-muted-foreground mt-4">For demonstration, try using any valid UUID format</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Report Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your report details are only accessible using your unique tracking ID. We do not store any connection
              between your identity and the report unless you chose to provide your information.
            </p>
            <div className="rounded-lg bg-muted p-3">
              <h4 className="text-sm font-medium mb-1">Tracking ID Security</h4>
              <p className="text-xs text-muted-foreground">
                Keep your tracking ID private. Anyone with this ID can view the status of your report.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you're having trouble tracking your report or need additional assistance, our support team is here to
              help.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">Email: support@securegovai.org</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">Hotline: +234-800-SECURE (732873)</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

