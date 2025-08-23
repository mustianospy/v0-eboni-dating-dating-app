
import { NextResponse } from 'next/server'

export class APIError extends Error {
  public statusCode: number
  public code: string

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.name = 'APIError'
  }
}

export function handleAPIError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof APIError) {
    return NextResponse.json(
      { 
        error: error.message, 
        code: error.code,
        success: false 
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    // Database connection errors
    if (error.message.includes('connect') || error.message.includes('timeout')) {
      return NextResponse.json(
        { 
          error: 'Database connection failed. Please try again later.', 
          code: 'DATABASE_ERROR',
          success: false 
        },
        { status: 503 }
      )
    }

    // Validation errors
    if (error.message.includes('validation') || error.message.includes('required')) {
      return NextResponse.json(
        { 
          error: 'Invalid input data provided.', 
          code: 'VALIDATION_ERROR',
          success: false 
        },
        { status: 400 }
      )
    }
  }

  // Generic server error
  return NextResponse.json(
    { 
      error: 'An unexpected error occurred. Please try again later.', 
      code: 'INTERNAL_ERROR',
      success: false 
    },
    { status: 500 }
  )
}

export function validateRequired(data: Record<string, any>, fields: string[]) {
  const missing = fields.filter(field => !data[field] || data[field].toString().trim() === '')
  
  if (missing.length > 0) {
    throw new APIError(
      `Missing required fields: ${missing.join(', ')}`,
      400,
      'MISSING_FIELDS'
    )
  }
}

export function createSuccessResponse(data: any, message?: string) {
  return NextResponse.json({
    success: true,
    data,
    message: message || 'Operation completed successfully'
  })
}
