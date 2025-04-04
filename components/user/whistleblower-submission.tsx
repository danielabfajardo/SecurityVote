"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Check, FileText, Info, Lock, Shield, Upload, User } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { submitWhistleblowerReport } from "@/lib/supabase"

export function WhistleblowerSubmission() {
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [trackingId, setTrackingId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Form fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [agency, setAgency] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [organization, setOrganization] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Create report object
      const reportData = {
        title,
        description,
        category,
        agency,
        is_anonymous: isAnonymous,
        submitter_name: isAnonymous ? undefined : name,
        submitter_email: isAnonymous ? undefined : email,
        submitter_phone: isAnonymous ? undefined : phone,
        submitter_organization: isAnonymous ? undefined : organization,
        evidence_urls: [],
      }

      // In a real implementation, we would use Supabase storage to upload files
      // and add their URLs to evidence_urls

      // Submit to database
      const result = await submitWhistleblowerReport(reportData)

      // Set tracking ID from result
      setTrackingId(result.id)
      setShowSuccessDialog(true)
    } catch (err: any) {
      setError(err.message || "Failed to submit report. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Submit Whistleblower Report</CardTitle>
          <CardDescription>Report suspicious activities or potential fraud related to security funds</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              <p className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="anonymous"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
                  >
                    Submit anonymously
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your identity will be protected and encrypted</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                </div>
              </div>

              {!isAnonymous && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      placeholder="Your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization (Optional)</Label>
                    <Input
                      id="organization"
                      placeholder="Your organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="category">Report Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Contract Fraud</SelectItem>
                    <SelectItem value="procurement">Procurement Fraud</SelectItem>
                    <SelectItem value="payroll">Payroll Fraud (Ghost Workers)</SelectItem>
                    <SelectItem value="funds">Misappropriation of Funds</SelectItem>
                    <SelectItem value="bribery">Bribery or Corruption</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="agency">Related Agency</Label>
                <Select value={agency} onValueChange={setAgency} required>
                  <SelectTrigger id="agency">
                    <SelectValue placeholder="Select agency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="border">Border Patrol</SelectItem>
                    <SelectItem value="cyber">Cyber Defense</SelectItem>
                    <SelectItem value="intelligence">Intelligence</SelectItem>
                    <SelectItem value="police">Police Force</SelectItem>
                    <SelectItem value="emergency">Emergency Response</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  placeholder="Brief title of your report"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the incident, including dates, names, locations, and any other relevant details"
                  className="min-h-[150px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence">Evidence Upload (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
                  <p className="text-xs text-muted-foreground">
                    Supports images, documents, and audio files (max 10MB)
                  </p>
                  <Input id="evidence" type="file" className="hidden" multiple />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("evidence")?.click()}
                  >
                    Select Files
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I confirm that the information provided is accurate to the best of my knowledge
                  </Label>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Whistleblower Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Secure & Encrypted</h4>
                <p className="text-sm text-muted-foreground">All reports are encrypted and stored securely</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Anonymous Reporting</h4>
                <p className="text-sm text-muted-foreground">Submit without revealing your identity</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Non-Retaliation Policy</h4>
                <p className="text-sm text-muted-foreground">Protected from any form of retaliation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-sm">What happens after I submit a report?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Your report will be reviewed by our independent investigation team. You'll receive a tracking ID to
                  check the status of your report.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-sm">How is my identity protected?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Anonymous reports have all identifying information removed. Your data is encrypted and only accessible
                  to authorized investigators.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-sm">What evidence should I provide?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Any documentation that supports your report: photos, documents, receipts, audio recordings, or other
                  relevant materials.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-sm">How long does the investigation take?</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  Investigation timelines vary based on complexity. Most reports receive initial assessment within 72
                  hours.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View All FAQs
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Report Submitted Successfully</DialogTitle>
            <DialogDescription>Your report has been submitted and will be reviewed by our team.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Your tracking ID:</p>
              <p className="text-xl font-bold font-mono">{trackingId}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Please save this ID to check the status of your report
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={() => setShowSuccessDialog(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                // Navigate to tracking page with the ID
                window.location.href = `/user?tab=track-report&id=${trackingId}`
              }}
            >
              Track Report Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

