import type { Metadata } from "next"
import { SafetyContent } from "@/components/safety/safety-content"

export const metadata: Metadata = {
  title: "Safety & Privacy - EboniDating",
  description: "Manage your safety settings and privacy controls",
}

export default function SafetyPage() {
  return <SafetyContent />
}
