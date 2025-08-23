
import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle } from "lucide-react"

export interface InputProps extends React.ComponentProps<"input"> {
  error?: string
  success?: boolean
  helperText?: string
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, helperText, label, id, ...props }, ref) => {
    const inputId = id || `input-${React.useId()}`
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            id={inputId}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              error && "border-destructive focus-visible:ring-destructive",
              success && "border-green-500 focus-visible:ring-green-500",
              className
            )}
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={cn(
              error && errorId,
              helperText && helperId
            )}
            {...props}
          />
          {error && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
          )}
          {success && !error && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
        </div>
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
