"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BioStepProps {
  formData: {
    bio: string
  }
  updateFormData: (data: any) => void
}

export function BioStep({ formData, updateFormData }: BioStepProps) {
  const maxLength = 500

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="bio" className="text-base">
          Tell Us About Yourself
        </Label>
        <p className="text-sm text-muted-foreground mt-1">
          Write a brief bio that showcases your personality and what you're looking for.
        </p>
      </div>

      <div className="space-y-2">
        <Textarea
          id="bio"
          placeholder="I love exploring new places, trying different cuisines, and having deep conversations over coffee. Looking for someone who shares my passion for adventure and isn't afraid to be themselves..."
          value={formData.bio}
          onChange={(e) => updateFormData({ bio: e.target.value })}
          className="min-h-[120px] resize-none"
          maxLength={maxLength}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Make it personal and authentic</span>
          <span>
            {formData.bio.length}/{maxLength}
          </span>
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium mb-2">Tips for a great bio:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Be authentic and genuine</li>
          <li>• Mention your hobbies and interests</li>
          <li>• Share what you're looking for</li>
          <li>• Keep it positive and engaging</li>
        </ul>
      </div>
    </div>
  )
}
