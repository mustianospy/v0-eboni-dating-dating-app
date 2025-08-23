export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validateField(value: any, rules: ValidationRule): string | null {
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return 'This field is required'
  }

  if (value && typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum length is ${rules.minLength} characters`
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength} characters`
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid format'
    }
  }

  if (rules.custom) {
    return rules.custom(value)
  }

  return null
}

export function validateForm(data: Record<string, any>, rules: Record<string, ValidationRule>): ValidationResult {
  const errors: Record<string, string> = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validateField(data[field], fieldRules)
    if (error) {
      errors[field] = error
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
}

// Common validation rules
export const CommonRules = {
  email: {
    required: true,
    pattern: ValidationPatterns.email,
    custom: (value: string) => {
      if (value && value.length > 254) return 'Email address is too long'
      return null
    }
  },
  password: {
    required: true,
    minLength: 8,
    pattern: ValidationPatterns.strongPassword,
    custom: (value: string) => {
      if (!value) return null
      if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter'
      if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter'
      if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number'
      if (!/(?=.*[@$!%*?&])/.test(value)) return 'Password must contain at least one special character'
      return null
    }
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    custom: (value: string) => {
      if (value && !/^[a-zA-Z\s'-]+$/.test(value)) {
        return 'Name can only contain letters, spaces, hyphens, and apostrophes'
      }
      return null
    }
  }
}

export const validatePhotoUpload = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return 'Please upload a valid image file (JPEG, PNG, or WebP)'
  }

  if (file.size > maxSize) {
    return 'Image size must be less than 5MB'
  }

  return null
}

export const validateCardNumber = (cardNumber: string): string | null => {
  const cleaned = cardNumber.replace(/\s/g, '')

  if (!/^\d{13,19}$/.test(cleaned)) {
    return 'Card number must be 13-19 digits'
  }

  // Luhn algorithm check
  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  if (sum % 10 !== 0) {
    return 'Invalid card number'
  }

  return null
}

export const validateExpiryDate = (expiryDate: string): string | null => {
  const [month, year] = expiryDate.split('/')

  if (!month || !year || month.length !== 2 || year.length !== 2) {
    return 'Expiry date must be in MM/YY format'
  }

  const monthNum = parseInt(month)
  const yearNum = parseInt(year) + 2000

  if (monthNum < 1 || monthNum > 12) {
    return 'Invalid month'
  }

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return 'Card has expired'
  }

  return null
}

export const validateCVV = (cvv: string): string | null => {
  if (!/^\d{3,4}$/.test(cvv)) {
    return 'CVV must be 3-4 digits'
  }

  return null
}