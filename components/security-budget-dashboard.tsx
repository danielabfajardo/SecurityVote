"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ArrowDown, ArrowUp, Calendar, DollarSign, Filter, Search } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "@/components/ui/chart"
import { useState } from "react"
import { useBudgetData, useBudgetAllocationByAgency, useBudgetTrends, useRecentActivity } from "@/hooks/use-data"
import { DataLoader, TableSkeleton, ChartSkeleton } from "@/components/ui/data-loader"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function SecurityBudgetDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [agencyFilter, setAgencyFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")

  const { data: transactions, isLoading: isLoadingTransactions, error: transactionsError } = useBudgetData()
  const { data: budgetData, isLoading: isLoadingBudgetData, error: budgetDataError } = useBudgetTrends()
  const { data: pieData, isLoading: isLoadingPieData, error: pieDataError } = useBudgetAllocationByAgency()
  const { data: recentActivity, isLoading: isLoadingActivity, error: activityError } = useRecentActivity()

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions?.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.agency.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAgency = agencyFilter === "all" || transaction.agency.toLowerCase() === agencyFilter.toLowerCase()
    const matchesRisk = riskFilter === "all" || transaction.risk.toLowerCase() === riskFilter.toLowerCase()

    return matchesSearch && matchesAgency && matchesRisk
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>Total security budget allocation and spending</CardDescription>
        </CardHeader>
        <CardContent>
          <DataLoader
            isLoading={isLoadingBudgetData}
            error={budgetDataError}
            data={budgetData}
            loadingComponent={<ChartSkeleton />}
          >
            {(data) => (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">Total Budget</span>
                    <span className="text-2xl font-bold">₦15.5B</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">Allocated</span>
                    <span className="text-2xl font-bold">₦10.2B</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">Remaining</span>
                    <span className="text-2xl font-bold">₦5.3B</span>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Budget Utilization</span>
                    <span className="text-sm font-medium">65.8%</span>
                  </div>
                  <Progress value={65.8} className="h-2" />
                </div>
                <div className="mt-6 h-[240px]">
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
                      <Legend />
                      <Bar dataKey="allocated" fill="#8884d8" name="Allocated" />
                      <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </DataLoader>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transaction List</CardTitle>
            <CardDescription>Recent approved payments and flagged transactions</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="w-[200px] rounded-lg pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Select value={agencyFilter} onValueChange={setAgencyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Agency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agencies</SelectItem>
                <SelectItem value="Border Patrol">Border Patrol</SelectItem>
                <SelectItem value="Cyber Defense">Cyber Defense</SelectItem>
                <SelectItem value="Intelligence">Intelligence</SelectItem>
                <SelectItem value="Police Force">Police Force</SelectItem>
                <SelectItem value="Emergency Response">Emergency Response</SelectItem>
              </SelectContent>
            </Select>
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
          </div>

          <DataLoader
            isLoading={isLoadingTransactions}
            error={transactionsError}
            data={filteredTransactions}
            loadingComponent={<TableSkeleton rows={5} columns={6} />}
          >
            {(transactions) => (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(transactions ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No transactions found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    (transactions ?? []).map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.agency}</TableCell>
                        <TableCell>₦{Number(transaction.amount).toLocaleString()}</TableCell>
                        <TableCell>
                          {transaction.status === "approved" ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                            >
                              Approved
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200 flex items-center gap-1"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              Flagged
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
          <CardTitle>Budget Allocation</CardTitle>
          <CardDescription>Distribution by security agency</CardDescription>
        </CardHeader>
        <CardContent>
          <DataLoader
            isLoading={isLoadingPieData}
            error={pieDataError}
            data={pieData}
            loadingComponent={<ChartSkeleton />}
          >
            {(data) => (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </DataLoader>
        </CardContent>
      </Card>

      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest budget activities and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <DataLoader
            isLoading={isLoadingActivity}
            error={activityError}
            data={recentActivity}
            loadingComponent={
              <div className="space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="rounded-full p-2 bg-muted">
                        <div className="h-4 w-4" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-full" />
                        <div className="h-3 bg-muted rounded w-1/2 mt-2" />
                      </div>
                    </div>
                  ))}
              </div>
            }
          >
            {(activities) => (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${activity.iconBg}`}>
                      {activity.icon === "dollar" && <DollarSign className={`h-4 w-4 ${activity.iconColor}`} />}
                      {activity.icon === "alert" && <AlertTriangle className={`h-4 w-4 ${activity.iconColor}`} />}
                      {activity.icon === "down" && <ArrowDown className={`h-4 w-4 ${activity.iconColor}`} />}
                      {activity.icon === "up" && <ArrowUp className={`h-4 w-4 ${activity.iconColor}`} />}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center pt-1">
                        <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{activity.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DataLoader>
        </CardContent>
      </Card>
    </div>
  )
}

