"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X } from "lucide-react"

interface PhotosStepProps {
  formData: {
    photos: string[]
  }
  updateFormData: (data: any) => void
}

export function PhotosStep({ formData, updateFormData }: PhotosStepProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)
    // In a real app, you'd upload to a service like UploadThing or AWS S3
    // For now, we'll simulate with placeholder URLs
    const newPhotos = Array.from(files).map(
      (file, index) =>
        `/placeholder.svg?height=300&width=300&query=profile photo ${formData.photos.length + index + 1}`,
    )

    updateFormData({ photos: [...formData.photos, ...newPhotos] })
    setIsUploading(false)
  }

  const removePhoto = (index: number) => {
    const updated = formData.photos.filter((_, i) => i !== index)
    updateFormData({ photos: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base">Add Your Photos</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Add at least 2 photos. Your first photo will be your main profile picture.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {formData.photos.map((photo, index) => (
          <Card key={index} className="relative aspect-square overflow-hidden">
            <img
              src={photo || "/placeholder.svg"}
              alt={`Profile photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => removePhoto(index)}
            >
              <X className="h-3 w-3" />
            </Button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                Main
              </div>
            )}
          </Card>
        ))}

        {formData.photos.length < 6 && (
          <Card className="aspect-square flex items-center justify-center border-dashed">
            <label className="cursor-pointer flex flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Add Photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </Card>
        )}
      </div>

      {isUploading && <p className="text-sm text-muted-foreground">Uploading photos...</p>}
    </div>
  )
}
