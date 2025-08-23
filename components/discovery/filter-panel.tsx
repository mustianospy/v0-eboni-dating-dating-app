"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface FilterPanelProps {
  filters: {
    ageRange: number[]
    maxDistance: number
    genders: string[]
    orientations: string[]
    interests: string[]
  }
  onFiltersChange: (filters: any) => void
  onClose: () => void
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
]

export function FilterPanel({ filters, onFiltersChange, onClose }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleGenderChange = (gender: string, checked: boolean) => {
    const updated = checked ? [...localFilters.genders, gender] : localFilters.genders.filter((g) => g !== gender)
    setLocalFilters({ ...localFilters, genders: updated })
  }

  const handleOrientationChange = (orientation: string, checked: boolean) => {
    const updated = checked
      ? [...localFilters.orientations, orientation]
      : localFilters.orientations.filter((o) => o !== orientation)
    setLocalFilters({ ...localFilters, orientations: updated })
  }

  const handleInterestChange = (interest: string, checked: boolean) => {
    const updated = checked
      ? [...localFilters.interests, interest]
      : localFilters.interests.filter((i) => i !== interest)
    setLocalFilters({ ...localFilters, interests: updated })
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
  }

  const clearFilters = () => {
    const clearedFilters = {
      ageRange: [18, 65],
      maxDistance: 50,
      genders: [],
      orientations: [],
      interests: [],
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Age Range */}
        <div className="space-y-3">
          <Label>
            Age Range: {localFilters.ageRange[0]} - {localFilters.ageRange[1]}
          </Label>
          <Slider
            value={localFilters.ageRange}
            onValueChange={(value) => setLocalFilters({ ...localFilters, ageRange: value })}
            min={18}
            max={65}
            step={1}
            className="w-full"
          />
        </div>

        {/* Distance */}
        <div className="space-y-3">
          <Label>Maximum Distance: {localFilters.maxDistance} miles</Label>
          <Slider
            value={[localFilters.maxDistance]}
            onValueChange={(value) => setLocalFilters({ ...localFilters, maxDistance: value[0] })}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Gender */}
        <div className="space-y-3">
          <Label>Gender</Label>
          <div className="grid grid-cols-2 gap-2">
            {GENDERS.map((gender) => (
              <div key={gender} className="flex items-center space-x-2">
                <Checkbox
                  id={`gender-${gender}`}
                  checked={localFilters.genders.includes(gender)}
                  onCheckedChange={(checked) => handleGenderChange(gender, checked as boolean)}
                />
                <Label htmlFor={`gender-${gender}`} className="text-sm">
                  {gender}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Orientation */}
        <div className="space-y-3">
          <Label>Orientation</Label>
          <div className="grid grid-cols-2 gap-2">
            {ORIENTATIONS.map((orientation) => (
              <div key={orientation} className="flex items-center space-x-2">
                <Checkbox
                  id={`orientation-${orientation}`}
                  checked={localFilters.orientations.includes(orientation)}
                  onCheckedChange={(checked) => handleOrientationChange(orientation, checked as boolean)}
                />
                <Label htmlFor={`orientation-${orientation}`} className="text-sm">
                  {orientation}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-3">
          <Label>Interests</Label>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {INTERESTS.map((interest) => (
              <Button
                key={interest}
                variant={localFilters.interests.includes(interest) ? "default" : "outline"}
                size="sm"
                onClick={() => handleInterestChange(interest, !localFilters.interests.includes(interest))}
                className="rounded-full text-xs"
              >
                {interest}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected filters summary */}
        {(localFilters.genders.length > 0 ||
          localFilters.orientations.length > 0 ||
          localFilters.interests.length > 0) && (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Active Filters:</Label>
            <div className="flex flex-wrap gap-1">
              {localFilters.genders.map((gender) => (
                <Badge key={gender} variant="secondary" className="text-xs">
                  {gender}
                </Badge>
              ))}
              {localFilters.orientations.map((orientation) => (
                <Badge key={orientation} variant="secondary" className="text-xs">
                  {orientation}
                </Badge>
              ))}
              {localFilters.interests.slice(0, 5).map((interest) => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {localFilters.interests.length > 5 && (
                <Badge variant="secondary" className="text-xs">
                  +{localFilters.interests.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex space-x-3 pt-4">
          <Button onClick={clearFilters} variant="outline" className="flex-1 bg-transparent">
            Clear All
          </Button>
          <Button onClick={applyFilters} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </>
  )
}
