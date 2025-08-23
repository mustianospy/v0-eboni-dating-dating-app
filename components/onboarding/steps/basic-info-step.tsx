"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BasicInfoStepProps {
  formData: {
    age: string
    location: string
  }
  updateFormData: (data: any) => void
}

export function BasicInfoStep({ formData, updateFormData }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          placeholder="25"
          value={formData.age}
          onChange={(e) => updateFormData({ age: e.target.value })}
          min="18"
          max="100"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="San Francisco, CA"
          value={formData.location}
          onChange={(e) => updateFormData({ location: e.target.value })}
        />
      </div>
    </div>
  )
}
