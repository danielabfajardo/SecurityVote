import { cn } from "@/lib/utils"
import type React from "react"

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  as?: React.ElementType
}

export function ResponsiveContainer({
  children,
  className,
  as: Component = "div",
  ...props
}: ResponsiveContainerProps) {
  return (
    <Component className={cn("w-full px-4 sm:px-6 md:px-8 mx-auto max-w-7xl", className)} {...props}>
      {children}
    </Component>
  )
}

