"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowUpDown, Download, FileText, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "@/components/ui/chart"
import { useState } from "react"
import { useFraudAlerts, useFraudPatterns, useFraudTrends } from "@/hooks/use-data"
import { DataLoader, TableSkeleton, ChartSkeleton } from "@/components/ui/data-loader"

export function FraudDetectionPanel() {
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")

  const { data: fraudAlerts, isLoading: isLoadingAlerts, error: alertsError } = useFraudAlerts()
  const { data: patternData, isLoading: isLoadingPatterns, error: patternsError } = useFraudPatterns()
  const { data: trendData, isLoading: isLoadingTrends, error: trendsError } = useFraudTrends()

  const filteredAlerts = fraudAlerts?.filter((alert) => {
    const matchesSearch =
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.pattern.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRisk = riskFilter === "all" || alert.status.toLowerCase() === riskFilter.toLowerCase()

    return matchesSearch && matchesRisk
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>AI Fraud Alerts</CardTitle>
            <CardDescription>Suspicious transactions flagged by AI</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search alerts..."
                className="w-full rounded-lg pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>

          <DataLoader
            isLoading={isLoadingAlerts}
            error={alertsError}
            data={filteredAlerts}
            loadingComponent={<TableSkeleton rows={5} columns={7} />}
          >
            {(alerts) => (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Amount
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Risk Score
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(alerts ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No fraud alerts found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    (alerts ?? []).map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">{alert.id}</TableCell>
                        <TableCell>{alert.description}</TableCell>
                        <TableCell>{alert.date}</TableCell>
                        <TableCell>{alert.agency}</TableCell>
                        <TableCell>₦{Number(alert.amount).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-medium ${
                                alert.risk_score >= 80
                                  ? "text-red-600"
                                  : alert.risk_score >= 60
                                    ? "text-amber-600"
                                    : "text-green-600"
                              }`}
                            >
                              {alert.risk_score}
                            </span>
                            <div className="h-2 w-16 rounded-full bg-gray-200">
                              <div
                                className={`h-full rounded-full ${
                                  alert.risk_score >= 80
                                    ? "bg-red-600"
                                    : alert.risk_score >= 60
                                      ? "bg-amber-600"
                                      : "bg-green-600"
                                }`}
                                style={{ width: `${alert.risk_score}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {alert.status === "high" ? (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200 flex items-center gap-1"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              High Risk
                            </Badge>
                          ) : alert.status === "medium" ? (
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                            >
                              Medium Risk
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                            >
                              Low Risk
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </DataLoader>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Fraud Analytics</CardTitle>
          <CardDescription>Patterns and trends in detected fraud</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="patterns" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patterns">Fraud Patterns</TabsTrigger>
              <TabsTrigger value="trends">Fraud Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="patterns" className="space-y-4">
              <DataLoader
                isLoading={isLoadingPatterns}
                error={patternsError}
                data={patternData}
                loadingComponent={<ChartSkeleton />}
              >
                {(data) => (
                  <>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8" name="Number of Cases" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <span>High Risk</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                        <span>Medium Risk</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span>Low Risk</span>
                      </div>
                    </div>
                  </>
                )}
              </DataLoader>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <DataLoader
                isLoading={isLoadingTrends}
                error={trendsError}
                data={trendData}
                loadingComponent={<ChartSkeleton />}
              >
                {(data) => (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={data}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="fraudCases" stroke="#8884d8" name="Fraud Cases" />
                        <Line yAxisId="right" type="monotone" dataKey="amount" stroke="#82ca9d" name="Amount (₦B)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </DataLoader>
            </TabsContent>
          </Tabs>

          <div className="mt-4 space-y-4">
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Latest Audit Report</h4>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                AI analysis detected a 15% increase in duplicate payment attempts compared to last quarter.
              </p>
              <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-sm">
                View full report
              </Button>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h4 className="text-sm font-medium">Risk Alert</h4>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Multiple high-value transactions from Intelligence agency require immediate review.
              </p>
              <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-sm">
                View transactions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

