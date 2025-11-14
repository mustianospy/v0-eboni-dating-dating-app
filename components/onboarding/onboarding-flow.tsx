"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, ArrowRight } from 'lucide-react';
import BasicInfoStep from "./steps/basic-info-step";
import GenderOrientationStep from "./steps/gender-orientation-step";
import InterestsStep from "./steps/interests-step";
import PhotosStep from "./steps/photos-step";
import BioStep from "./steps/bio-step";

const STEPS = [
  { id: "basic", title: "Basic Info", component: BasicInfoStep },
  { id: "identity", title: "Identity", component: GenderOrientationStep },
  { id: "interests", title: "Interests", component: InterestsStep },
  { id: "photos", title: "Photos", component: PhotosStep },
  { id: "bio", title: "About You", component: BioStep },
];

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    age: "",
    location: "",
    gender: "",
    orientation: "",
    lookingFor: [] as string[],
    interests: [] as string[],
    photos: [] as string[],
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data });
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="relative">
            <Heart className="h-10 w-10 text-gradient bg-gradient-to-r from-violet-600 to-pink-600 fill-current" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-pulse"></div>
          </div>
          <span className="text-3xl font-serif font-black bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            EboniDating
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          Let's Set Up Your Profile
        </h1>
        <p className="text-muted-foreground text-lg">
          Step {currentStep + 1} of {STEPS.length}: <span className="font-semibold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">{STEPS[currentStep].title}</span>
        </p>
      </div>

      <div className="mb-8">
        <Progress value={progress} className="h-3 bg-gradient-to-r from-violet-100 to-pink-100 dark:from-violet-900/20 dark:to-pink-900/20" />
      </div>

      <Card className="border-0 bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-2xl glow-primary">
        <CardHeader className="bg-gradient-to-r from-violet-100 to-pink-100 dark:from-violet-950/50 dark:to-pink-950/50 border-b border-violet-200 dark:border-violet-800">
          <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">{STEPS[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
          />

          <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-violet-200 dark:border-violet-800">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="border-2 border-violet-300 hover:bg-violet-50 dark:border-violet-700 dark:hover:bg-violet-950 disabled:opacity-50"
            >
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={isLoading}
              className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {currentStep === STEPS.length - 1
                ? isLoading
                  ? "Completing..."
                  : "Complete Profile"
                : "Next"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <div className="flex justify-center gap-2">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index <= currentStep
                  ? "bg-gradient-to-r from-violet-600 to-pink-600 w-8"
                  : "bg-gray-300 dark:bg-gray-700 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
