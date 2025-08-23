
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
