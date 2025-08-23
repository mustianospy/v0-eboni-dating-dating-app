
'use client'

import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // You can integrate with services like Sentry here
      console.error('Production error:', error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback
      return <Fallback error={this.state.error!} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  const isDev = process.env.NODE_ENV === 'development'
  
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <CardTitle className="text-xl font-semibold">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            We encountered an unexpected error. Don't worry, this has been reported to our team.
          </p>
          
          {isDev && (
            <details className="mt-4 p-3 bg-muted rounded-md">
              <summary className="cursor-pointer font-medium text-sm">Error Details (Dev Mode)</summary>
              <pre className="mt-2 text-xs overflow-auto whitespace-pre-wrap">{error.message}</pre>
              {error.stack && (
                <pre className="mt-1 text-xs text-muted-foreground overflow-auto whitespace-pre-wrap">
                  {error.stack}
                </pre>
              )}
            </details>
          )}
          
          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={resetError} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'} 
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for handling async errors in functional components
export function useErrorHandler() {
  return (error: Error) => {
    console.error('Async error:', error)
    // In a real app, you might want to show a toast notification
    throw error // Re-throw to be caught by error boundary
  }
}
