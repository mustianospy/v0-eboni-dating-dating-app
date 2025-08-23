
"use client"

import { cn } from "@/lib/utils"

interface LoadingProps {
  className?: string
  size?: "sm" | "md" | "lg"
  text?: string
}

export function Loading({ className, size = "md", text }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <div className={cn("animate-spin rounded-full border-2 border-primary border-t-transparent", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading size="lg" text="Loading..." />
    </div>
  )
}

export function InlineLoading({ text }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2 p-4">
      <Loading size="sm" />
      {text && <span className="text-sm">{text}</span>}
    </div>
  )
}
