"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Eye, Camera, AlertTriangle, UserX, Flag } from "lucide-react"
import { BlockedUsersTab } from "./blocked-users-tab"
import { ReportHistoryTab } from "./report-history-tab"
import { VerificationTab } from "./verification-tab"

export function SafetyContent() {
  const [nsfwBlur, setNsfwBlur] = useState(true)
  const [aiModeration, setAiModeration] = useState(true)
  const [readReceipts, setReadReceipts] = useState(true)
  const [onlineStatus, setOnlineStatus] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Safety & Privacy</h1>
        <p className="text-muted-foreground">
          Manage your safety settings and privacy controls to ensure a secure dating experience.
        </p>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="verification" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Photo Verification
          </TabsTrigger>
          <TabsTrigger value="bvn" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            BVN Verification
          </TabsTrigger>
          <TabsTrigger value="blocked" className="flex items-center gap-2">
            <UserX className="h-4 w-4" />
            Blocked
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Content Safety
              </CardTitle>
              <CardDescription>Control how sensitive content is displayed and moderated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">NSFW Content Blur</h4>
                  <p className="text-sm text-muted-foreground">Automatically blur potentially sensitive images</p>
                </div>
                <Switch checked={nsfwBlur} onCheckedChange={setNsfwBlur} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">AI Content Moderation</h4>
                  <p className="text-sm text-muted-foreground">Use AI to detect and filter inappropriate content</p>
                </div>
                <Switch checked={aiModeration} onCheckedChange={setAiModeration} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy Controls
              </CardTitle>
              <CardDescription>Manage your visibility and communication preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Read Receipts</h4>
                  <p className="text-sm text-muted-foreground">Let others know when you've read their messages</p>
                </div>
                <Switch checked={readReceipts} onCheckedChange={setReadReceipts} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Online Status</h4>
                  <p className="text-sm text-muted-foreground">Show when you're active on the app</p>
                </div>
                <Switch checked={onlineStatus} onCheckedChange={setOnlineStatus} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Safety Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium mb-1">Meet in Public</h4>
                  <p className="text-sm text-muted-foreground">
                    Always meet new connections in public places for your first few dates.
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium mb-1">Trust Your Instincts</h4>
                  <p className="text-sm text-muted-foreground">
                    If something feels off, don't hesitate to block or report the user.
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium mb-1">Protect Personal Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Don't share sensitive information like your address or financial details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <VerificationTab />
        </TabsContent>

        <TabsContent value="bvn">
          {/* BVN Verification Component will go here */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">BVN Verification</h2>
            <p className="text-muted-foreground mb-4">
              To verify your identity, please enter your Bank Verification Number (BVN).
              This helps ensure the authenticity of our users.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="bvn" className="block text-sm font-medium text-foreground">BVN Number</label>
                <input
                  type="text"
                  id="bvn"
                  placeholder="Enter your BVN"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Verify BVN
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="blocked">
          <BlockedUsersTab />
        </TabsContent>

        <TabsContent value="reports">
          <ReportHistoryTab />
        </TabsContent>

        <TabsContent value="privacy">
          {/* Placeholder for Privacy Tab content */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Privacy settings content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}