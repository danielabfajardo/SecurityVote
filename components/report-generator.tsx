"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ArrowUpIcon as ArrowDownload, Check, FileText, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function ReportGenerator() {
  const [open, setOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [reportType, setReportType] = useState("budget")
  const [dateRange, setDateRange] = useState("month")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeRawData, setIncludeRawData] = useState(false)
  const [reportFormat, setReportFormat] = useState("pdf")
  const [reportTitle, setReportTitle] = useState("")
  const [reportNotes, setReportNotes] = useState("")

  const handleGenerate = () => {
    setIsGenerating(true)

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      setIsGenerated(true)
    }, 3000)
  }

  const resetForm = () => {
    setIsGenerated(false)
    setReportType("budget")
    setDateRange("month")
    setIncludeCharts(true)
    setIncludeRawData(false)
    setReportFormat("pdf")
    setReportTitle("")
    setReportNotes("")
  }

  const handleClose = () => {
    setOpen(false)
    // Reset form after dialog closes
    setTimeout(resetForm, 300)
  }

  const getReportTypeLabel = () => {
    switch (reportType) {
      case "budget":
        return "Budget Allocation & Spending"
      case "fraud":
        return "Fraud Detection & Prevention"
      case "approval":
        return "Multi-Signature Approvals"
      case "whistleblower":
        return "Whistleblower Reports"
      case "comprehensive":
        return "Comprehensive Security Report"
      default:
        return "Custom Report"
    }
  }

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case "week":
        return "Past Week"
      case "month":
        return "Past Month"
      case "quarter":
        return "Past Quarter"
      case "year":
        return "Past Year"
      case "custom":
        return "Custom Date Range"
      default:
        return "Past Month"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Generate Report</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Generate Security Report</DialogTitle>
          <DialogDescription>Create a customized report with selected data and metrics</DialogDescription>
        </DialogHeader>

        {!isGenerated ? (
          <Tabs defaultValue="options" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="options">Report Options</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="options" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-title">Report Title</Label>
                  <Input
                    id="report-title"
                    placeholder="Enter report title"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget Allocation & Spending</SelectItem>
                      <SelectItem value="fraud">Fraud Detection & Prevention</SelectItem>
                      <SelectItem value="approval">Multi-Signature Approvals</SelectItem>
                      <SelectItem value="whistleblower">Whistleblower Reports</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Security Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger id="date-range">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Past Week</SelectItem>
                      <SelectItem value="month">Past Month</SelectItem>
                      <SelectItem value="quarter">Past Quarter</SelectItem>
                      <SelectItem value="year">Past Year</SelectItem>
                      <SelectItem value="custom">Custom Date Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {dateRange === "custom" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input id="start-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input id="end-date" type="date" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="report-format">Report Format</Label>
                  <Select value={reportFormat} onValueChange={setReportFormat}>
                    <SelectTrigger id="report-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV Data File</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-charts"
                    checked={includeCharts}
                    onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                  />
                  <Label htmlFor="include-charts">Include charts and visualizations</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-raw-data"
                    checked={includeRawData}
                    onCheckedChange={(checked) => setIncludeRawData(checked as boolean)}
                  />
                  <Label htmlFor="include-raw-data">Include raw data tables</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-notes">Additional Notes</Label>
                  <Textarea
                    id="report-notes"
                    placeholder="Add any additional notes or context for this report"
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Report Generated Successfully</h3>
              <p className="text-sm text-muted-foreground">
                Your {getReportTypeLabel()} report for the {getDateRangeLabel()} is ready to download
              </p>
            </div>

            <div className="w-full max-w-sm border rounded-lg p-4 mt-4 bg-muted/50">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "rounded-lg p-2",
                    reportFormat === "pdf" ? "bg-red-100" : reportFormat === "excel" ? "bg-green-100" : "bg-blue-100",
                  )}
                >
                  <FileText
                    className={cn(
                      "h-6 w-6",
                      reportFormat === "pdf"
                        ? "text-red-600"
                        : reportFormat === "excel"
                          ? "text-green-600"
                          : "text-blue-600",
                    )}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{reportTitle || `${getReportTypeLabel()} Report`}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generated on {format(new Date(), "MMMM d, yyyy")}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="default" size="sm" className="w-full gap-1" onClick={handleClose}>
                      <ArrowDownload className="h-4 w-4" />
                      Download {reportFormat.toUpperCase()}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {!isGenerated ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

