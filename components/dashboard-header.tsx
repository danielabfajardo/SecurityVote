"use client"

import { Bell, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "@/components/mobile-nav"
import { UserNav } from "@/components/user-nav"
import { ReportGenerator } from "@/components/report-generator"
import { useAuthState } from "@/hooks/use-auth-state"
import { ResponsiveContainer } from "@/components/layout/responsive-container"

export function DashboardHeader() {
  const { user } = useAuthState()

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <ResponsiveContainer className="flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <MobileNav />
            </SheetContent>
          </Sheet>
          <div className="hidden md:flex">
            <div className="font-bold text-xl flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1 rounded">Security</div>
              <span>Vote</span>
              {user?.role && (
                <span className="text-sm font-normal bg-muted px-2 py-1 rounded ml-2 capitalize">
                  {user.role} Portal
                </span>
              )}
            </div>
          </div>
          <div className="md:hidden font-bold text-lg">SecurityVote</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-64 rounded-lg pl-8" />
          </div>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
          <UserNav />
          <div className="hidden md:flex">
            <ReportGenerator />
          </div>
        </div>
      </ResponsiveContainer>
    </header>
  )
}

