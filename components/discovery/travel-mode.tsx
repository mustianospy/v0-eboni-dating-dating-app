"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { X, MapPin, Plane } from "lucide-react"

interface TravelModeProps {
  onClose: () => void
}

export function TravelMode({ onClose }: TravelModeProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [destination, setDestination] = useState("")
  const [travelDates, setTravelDates] = useState({
    start: "",
    end: "",
  })

  const handleSave = async () => {
    try {
      await fetch("/api/user/travel-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: isEnabled,
          destination,
          startDate: travelDates.start,
          endDate: travelDates.end,
        }),
      })
      onClose()
    } catch (error) {
      console.error("Error saving travel mode:", error)
    }
  }

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Plane className="h-5 w-5 text-primary" />
          <CardTitle>Travel Mode</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Enable Travel Mode</Label>
            <p className="text-sm text-muted-foreground">Connect with people in your travel destination</p>
          </div>
          <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
        </div>

        {isEnabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="destination"
                  placeholder="New York, NY"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={travelDates.start}
                  onChange={(e) => setTravelDates({ ...travelDates, start: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={travelDates.end}
                  onChange={(e) => setTravelDates({ ...travelDates, end: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Travel Mode Benefits:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Connect with locals and other travelers</li>
                <li>• Get recommendations for your destination</li>
                <li>• Find travel companions and activity partners</li>
                <li>• Your profile will be shown to users in that area</li>
              </ul>
            </div>
          </>
        )}

        <div className="flex space-x-3 pt-4">
          <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
        </div>
      </CardContent>
    </>
  )
}
