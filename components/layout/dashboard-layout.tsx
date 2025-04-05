import type React from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { ResponsiveContainer } from "@/components/layout/responsive-container"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  actions?: React.ReactNode
}

export function DashboardLayout({ children, title, actions }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 py-6">
        <ResponsiveContainer>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
            {actions && <div className="mt-4 sm:mt-0">{actions}</div>}
          </div>
          {children}
        </ResponsiveContainer>
      </main>
    </div>
  )
}

