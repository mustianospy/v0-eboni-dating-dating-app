
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, CheckCircle, Clock, AlertCircle, Shield } from "lucide-react"

export function BvnVerificationTab() {
  const [bvn, setBvn] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<"none" | "pending" | "verified" | "failed">("none")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const validateBvn = (bvnNumber: string) => {
    // BVN should be 11 digits
    const bvnRegex = /^\d{11}$/
    return bvnRegex.test(bvnNumber)
  }

  const handleVerifyBvn = async () => {
    if (!validateBvn(bvn)) {
      setError("Please enter a valid 11-digit BVN")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/user/verify-bvn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bvn }),
      })

      const data = await response.json()

      if (response.ok) {
        setVerificationStatus("verified")
      } else {
        setVerificationStatus("failed")
        setError(data.error || "BVN verification failed")
      }
    } catch (error) {
      console.error("BVN verification error:", error)
      setVerificationStatus("failed")
      setError("An error occurred during verification")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = () => {
    switch (verificationStatus) {
      case "none":
        return null
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Verifying
          </Badge>
        )
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            BVN Verified
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Verification Failed
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          BVN Verification
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>
          Verify your Bank Verification Number for enhanced trust and security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {verificationStatus === "none" && (
          <>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Why verify your BVN?
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Enhance profile credibility and trust</li>
                  <li>• Unlock premium verification features</li>
                  <li>• Improve match quality and safety</li>
                  <li>• Comply with Nigerian financial regulations</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bvn">Bank Verification Number (BVN)</Label>
                <Input
                  id="bvn"
                  type="text"
                  placeholder="Enter your 11-digit BVN"
                  value={bvn}
                  onChange={(e) => {
                    setBvn(e.target.value)
                    setError("")
                  }}
                  maxLength={11}
                  className={error ? "border-red-500" : ""}
                />
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Your BVN is kept secure and never shared with other users
                </p>
              </div>

              <Button 
                onClick={handleVerifyBvn} 
                className="w-full" 
                disabled={isLoading || !bvn}
              >
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Verifying BVN...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Verify BVN
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {verificationStatus === "verified" && (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-medium mb-2">BVN Verified Successfully!</h3>
            <p className="text-sm text-muted-foreground">
              Your Bank Verification Number has been verified. This increases your profile trust score
              and unlocks premium features.
            </p>
          </div>
        )}

        {verificationStatus === "failed" && (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-medium mb-2">BVN Verification Failed</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error || "We couldn't verify your BVN. Please check the number and try again."}
            </p>
            <Button 
              onClick={() => {
                setVerificationStatus("none")
                setBvn("")
                setError("")
              }} 
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
