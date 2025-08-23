"use client"

import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface InterestsStepProps {
  formData: {
    interests: string[]
  }
  updateFormData: (data: any) => void
}

const INTERESTS = [
  "Art",
  "Music",
  "Travel",
  "Food",
  "Fitness",
  "Reading",
  "Movies",
  "Gaming",
  "Photography",
  "Dancing",
  "Hiking",
  "Cooking",
  "Yoga",
  "Fashion",
  "Tech",
  "Sports",
  "Theater",
  "Writing",
  "Volunteering",
  "Pets",
  "Coffee",
  "Wine",
  "Meditation",
  "Gardening",
  "Crafts",
  "Comedy",
  "History",
  "Science",
]

export function InterestsStep({ formData, updateFormData }: InterestsStepProps) {
  const toggleInterest = (interest: string) => {
    const updated = formData.interests.includes(interest)
      ? formData.interests.filter((item) => item !== interest)
      : [...formData.interests, interest]
    updateFormData({ interests: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base">Select Your Interests</Label>
        <p className="text-sm text-muted-foreground mt-1">Choose at least 3 interests to help us find better matches</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((interest) => (
          <Button
            key={interest}
            variant={formData.interests.includes(interest) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleInterest(interest)}
            className="rounded-full"
          >
            {interest}
          </Button>
        ))}
      </div>

      {formData.interests.length > 0 && (
        <div>
          <Label className="text-sm text-muted-foreground">Selected ({formData.interests.length}):</Label>
          <div className="flex flex-wrap gap-1 mt-2">
            {formData.interests.map((interest) => (
              <Badge key={interest} variant="secondary">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
