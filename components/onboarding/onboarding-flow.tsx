"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart } from "lucide-react"
import { BasicInfoStep } from "./steps/basic-info-step"
import { GenderOrientationStep } from "./steps/gender-orientation-step"
import { InterestsStep } from "./steps/interests-step"
import { PhotosStep } from "./steps/photos-step"
import { BioStep } from "./steps/bio-step"

const STEPS = [
  { id: "basic", title: "Basic Info", component: BasicInfoStep },
  { id: "identity", title: "Identity", component: GenderOrientationStep },
  { id: "interests", title: "Interests", component: InterestsStep },
  { id: "photos", title: "Photos", component: PhotosStep },
  { id: "bio", title: "About You", component: BioStep },
]

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    age: "",
    location: "",
    gender: "",
    orientation: "",
    lookingFor: [] as string[],
    interests: [] as string[],
    photos: [] as string[],
    bio: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const progress = ((currentStep + 1) / STEPS.length) * 100

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Onboarding error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data })
  }

  const CurrentStepComponent = STEPS[currentStep].component

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Heart className="h-8 w-8 text-primary" />
          <span className="text-2xl font-serif font-bold">EboniDating</span>
        </div>
        <h1 className="text-3xl font-serif font-bold mb-2">Let's Set Up Your Profile</h1>
        <p className="text-muted-foreground">
          Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
        </p>
      </div>

      <div className="mb-8">
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent formData={formData} updateFormData={updateFormData} />

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={isLoading}>
              {currentStep === STEPS.length - 1 ? (isLoading ? "Completing..." : "Complete Profile") : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
