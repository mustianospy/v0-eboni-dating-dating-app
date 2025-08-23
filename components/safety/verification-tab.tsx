
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, CheckCircle, Clock, AlertCircle } from "lucide-react"

export function VerificationTab() {
  const [verificationStatus, setVerificationStatus] = useState<"none" | "pending" | "verified" | "rejected">("none")

  const handleStartVerification = () => {
    setVerificationStatus("pending")
    // Simulate verification process
    setTimeout(() => {
      setVerificationStatus("verified")
    }, 3000)
  }

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case "none":
        return null
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        )
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          Profile Verification
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>Verify your identity to increase trust and get more matches</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {verificationStatus === "none" && (
          <>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Why verify your profile?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Increase trust with potential matches</li>
                  <li>• Get priority in discovery</li>
                  <li>• Access to verified-only features</li>
                  <li>• Reduce fake profiles in your matches</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Verification Process</h4>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Take a selfie following the pose shown</li>
                  <li>2. Our AI will verify it matches your profile photos</li>
                  <li>3. Get verified within 24 hours</li>
                </ol>
              </div>
            </div>

            <Button onClick={handleStartVerification} className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              Start Photo Verification
            </Button>
          </>
        )}

        {verificationStatus === "pending" && (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="font-medium mb-2">Verification in Progress</h3>
            <p className="text-sm text-muted-foreground">
              We're reviewing your verification photos. This usually takes up to 24 hours.
            </p>
          </div>
        )}

        {verificationStatus === "verified" && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-medium mb-2">Profile Verified!</h3>
            <p className="text-sm text-muted-foreground">
              Your profile is now verified. You'll see increased visibility and trust from other users.
            </p>
          </div>
        )}

        {verificationStatus === "rejected" && (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-medium mb-2">Verification Failed</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't verify your photos. Please try again with clearer images.
            </p>
            <Button onClick={() => setVerificationStatus("none")} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
