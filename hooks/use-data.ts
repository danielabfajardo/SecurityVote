"use client"

import { useState, useEffect } from "react"
import * as api from "@/lib/api"

// Generic data fetching hook
export function useData<T>(fetchFn: () => Promise<T>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await fetchFn()
        if (isMounted) {
          setData(result)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("An unknown error occurred"))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return { data, isLoading, error, refetch: () => {} }
}

// Specific data hooks
export function useBudgetData() {
  return useData(api.getBudgetData)
}

export function useBudgetSummary() {
  return useData(api.getBudgetSummary)
}

export function useBudgetAllocationByAgency() {
  return useData(api.getBudgetAllocationByAgency)
}

export function useBudgetTrends() {
  return useData(api.getBudgetTrends)
}

export function useFraudAlerts() {
  return useData(api.getFraudAlerts)
}

export function useFraudPatterns() {
  return useData(api.getFraudPatterns)
}

export function useFraudTrends() {
  return useData(api.getFraudTrends)
}

export function useApprovalRequests() {
  return useData(api.getApprovalRequests)
}

export function useWhistleblowerReports() {
  return useData(api.getWhistleblowerReports)
}

export function useWhistleblowerReport(id: string | null) {
  return useData(() => (id ? api.getWhistleblowerReportById(id) : Promise.resolve(null)), [id])
}

export function usePublicReports() {
  return useData(api.getPublicReports)
}

export function useRecentActivity() {
  return useData(api.getRecentActivity)
}

