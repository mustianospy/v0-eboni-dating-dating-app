"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flag, Clock, CheckCircle, XCircle } from "lucide-react"

interface Report {
  id: string
  reportedUser: string
  reason: string
  status: "pending" | "resolved" | "dismissed"
  createdAt: string
  resolvedAt?: string
}

export function ReportHistoryTab() {
  const [reports] = useState<Report[]>([
    {
      id: "1",
      reportedUser: "John Doe",
      reason: "Inappropriate messages",
      status: "resolved",
      createdAt: "2024-01-20",
      resolvedAt: "2024-01-22",
    },
    {
      id: "2",
      reportedUser: "Jane Smith",
      reason: "Fake profile",
      status: "pending",
      createdAt: "2024-01-25",
    },
  ])

  const getStatusIcon = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "dismissed":
        return <XCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "dismissed":
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-destructive" />
          Report History
        </CardTitle>
        <CardDescription>Track the status of reports you've submitted</CardDescription>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No reports submitted</h3>
            <p className="text-sm text-muted-foreground">Reports you submit will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">Report against {report.reportedUser}</h4>
                    <p className="text-sm text-muted-foreground">{report.reason}</p>
                  </div>
                  <Badge className={getStatusColor(report.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(report.status)}
                      {report.status}
                    </div>
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Submitted: {new Date(report.createdAt).toLocaleDateString()}
                  {report.resolvedAt && (
                    <span className="ml-4">Resolved: {new Date(report.resolvedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
