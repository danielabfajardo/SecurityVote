"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpIcon as ArrowDownload, Calendar, Download, FileText, Filter, Globe, Search } from "lucide-react"
import { useState } from "react"
import { ApproverHeader } from "@/components/approver/approver-header"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { usePublicReports } from "@/hooks/use-data"
import { DataLoader, TableSkeleton } from "@/components/ui/data-loader"

export default function ApproverReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const { data: reports, isLoading, error } = usePublicReports()

  // Filter reports based on search and type
  const filteredReports = reports?.filter((report) => {
    const matchesSearch = searchTerm === "" || report.title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || report.type === typeFilter

    return matchesSearch && matchesType
  })

  return (
    <div className="flex min-h-screen flex-col">
      <ApproverHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Reports & Documents</h2>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              <Globe className="mr-1 h-3 w-3" />
              Observer
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>Access financial and audit reports for review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search reports..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="audit">Audit</SelectItem>
                    <SelectItem value="sustainability">Sustainability</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <DataLoader
              isLoading={isLoading}
              error={error}
              data={filteredReports}
              loadingComponent={<TableSkeleton rows={5} columns={5} />}
            >
              {(reports) => (
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            No reports found matching your filters
                          </TableCell>
                        </TableRow>
                      ) : (
                        reports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{report.title}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span>{report.date}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  report.type === "financial"
                                    ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                                    : report.type === "audit"
                                      ? "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                                      : "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                                }
                              >
                                {report.type === "financial"
                                  ? "Financial"
                                  : report.type === "audit"
                                    ? "Audit"
                                    : "Sustainability"}
                              </Badge>
                            </TableCell>
                            <TableCell>{report.size}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() => window.open(report.file_url, "_blank")}
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </DataLoader>

            <div className="mt-6 flex justify-end">
              <Button className="gap-2">
                <ArrowDownload className="h-4 w-4" />
                Download All Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

