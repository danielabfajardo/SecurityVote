"use client"

import { Info, Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserMobileNav } from "@/components/user/user-mobile-nav"
import { UserNav } from "@/components/user-nav"
import Link from "next/link"

export function UserHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <UserMobileNav />
            </SheetContent>
          </Sheet>
          <div className="hidden md:flex">
            <div className="font-bold text-xl flex items-center gap-2">
              <div>Security</div>
              <span className="bg-primary text-primary-foreground p-1 rounded">Vote</span>
              <span className="text-sm font-normal bg-muted px-2 py-1 rounded ml-2">Public Portal</span>
            </div>
          </div>
          <div className="md:hidden font-bold text-lg">SecurityVote</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search public information..." className="w-64 rounded-lg pl-8" />
          </div>
          <Button variant="outline" size="icon" className="relative">
            <Info className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>
          <UserNav />
          <Button variant="default" size="sm" className="hidden md:flex" asChild>
            <Link href="/user/submit-report">Submit Report</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

