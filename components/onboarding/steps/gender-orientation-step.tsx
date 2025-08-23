"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface GenderOrientationStepProps {
  formData: {
    gender: string
    orientation: string
    lookingFor: string[]
  }
  updateFormData: (data: any) => void
}

const GENDERS = [
  "Male",
  "Female",
  "Non-binary",
  "Transgender Male",
  "Transgender Female",
  "Genderfluid",
  "Agender",
  "Other",
]

const ORIENTATIONS = [
  "Gay",
  "Lesbian",
  "Bisexual",
  "Pansexual",
  "Asexual",
  "Demisexual",
  "Queer",
  "Questioning",
  "Other",
]

const LOOKING_FOR = ["Relationship", "Friends", "Casual Dating", "Networking"]

export function GenderOrientationStep({ formData, updateFormData }: GenderOrientationStepProps) {
  const handleLookingForChange = (value: string, checked: boolean) => {
    const updated = checked ? [...formData.lookingFor, value] : formData.lookingFor.filter((item) => item !== value)
    updateFormData({ lookingFor: updated })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Gender Identity</Label>
        <Select value={formData.gender} onValueChange={(value) => updateFormData({ gender: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your gender identity" />
          </SelectTrigger>
          <SelectContent>
            {GENDERS.map((gender) => (
              <SelectItem key={gender} value={gender}>
                {gender}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sexual Orientation</Label>
        <Select value={formData.orientation} onValueChange={(value) => updateFormData({ orientation: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your orientation" />
          </SelectTrigger>
          <SelectContent>
            {ORIENTATIONS.map((orientation) => (
              <SelectItem key={orientation} value={orientation}>
                {orientation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Looking For</Label>
        <div className="grid grid-cols-2 gap-3">
          {LOOKING_FOR.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={formData.lookingFor.includes(option)}
                onCheckedChange={(checked) => handleLookingForChange(option, checked as boolean)}
              />
              <Label htmlFor={option} className="text-sm">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
