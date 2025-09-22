"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Brain, Sparkles } from "lucide-react"
import type { CompatibilityScore } from "@/lib/ai-matching"

interface CompatibilityCardProps {
  compatibility: CompatibilityScore
  showDetails?: boolean
}

export function CompatibilityCard({ compatibility, showDetails = false }: CompatibilityCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent Match"
    if (score >= 80) return "Great Match"
    if (score >= 70) return "Good Match"
    if (score >= 60) return "Fair Match"
    return "Low Match"
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Heart className="h-5 w-5 mr-2 text-pink-500" />
            Compatibility Score
          </CardTitle>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(compatibility.overall)}`}>{compatibility.overall}%</div>
            <div className="text-sm text-muted-foreground">{getScoreLabel(compatibility.overall)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div>
          <Progress value={compatibility.overall} className="h-3" />
        </div>

        {/* Reasons */}
        {compatibility.reasons.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2 flex items-center">
              <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
              Why you might click
            </h4>
            <div className="space-y-1">
              {compatibility.reasons.map((reason, index) => (
                <div key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  {reason}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Breakdown */}
        {showDetails && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center">
              <Brain className="h-4 w-4 mr-1" />
              Compatibility Breakdown
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Personality</span>
                <div className="flex items-center space-x-2">
                  <Progress value={compatibility.breakdown.personality} className="w-16 h-2" />
                  <span className="w-8 text-right">{compatibility.breakdown.personality}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Interests</span>
                <div className="flex items-center space-x-2">
                  <Progress value={compatibility.breakdown.interests} className="w-16 h-2" />
                  <span className="w-8 text-right">{compatibility.breakdown.interests}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Location</span>
                <div className="flex items-center space-x-2">
                  <Progress value={compatibility.breakdown.location} className="w-16 h-2" />
                  <span className="w-8 text-right">{compatibility.breakdown.location}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Age</span>
                <div className="flex items-center space-x-2">
                  <Progress value={compatibility.breakdown.age} className="w-16 h-2" />
                  <span className="w-8 text-right">{compatibility.breakdown.age}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Lifestyle</span>
                <div className="flex items-center space-x-2">
                  <Progress value={compatibility.breakdown.lifestyle} className="w-16 h-2" />
                  <span className="w-8 text-right">{compatibility.breakdown.lifestyle}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Potential Concerns */}
        {compatibility.potentialConcerns.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2 text-amber-600">Things to consider</h4>
            <div className="space-y-1">
              {compatibility.potentialConcerns.map((concern, index) => (
                <div key={index} className="text-sm text-amber-600 flex items-start">
                  <span className="mr-2">⚠️</span>
                  {concern}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
