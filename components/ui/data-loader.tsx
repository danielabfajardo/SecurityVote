"use client"

import type React from "react"

import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface DataLoaderProps<T> {
  isLoading: boolean
  error: Error | null
  data: T | null
  onRetry?: () => void
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  children: (data: T) => React.ReactNode
}

export function DataLoader<T>({
  isLoading,
  error,
  data,
  onRetry,
  loadingComponent,
  errorComponent,
  children,
}: DataLoaderProps<T>) {
  if (isLoading) {
    return (
      loadingComponent || (
        <div className="w-full p-8 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">Loading data...</p>
        </div>
      )
    )
  }

  if (error) {
    return (
      errorComponent || (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{error.message || "An error occurred while fetching data"}</p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Try Again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )
    )
  }

  if (!data) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No data is available at this time.</AlertDescription>
      </Alert>
    )
  }

  return <>{children(data)}</>
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="w-full space-y-3">
      <div className="flex gap-4">
        {Array(columns)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-8 flex-1" />
          ))}
      </div>
      {Array(rows)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array(columns)
              .fill(0)
              .map((_, j) => (
                <Skeleton key={j} className="h-12 flex-1" />
              ))}
          </div>
        ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  )
}

