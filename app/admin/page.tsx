import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard - EboniDating",
  description: "Administrative dashboard for managing the EboniDating platform",
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Check if user is admin (in real app, check user role from database)
  const isAdmin = session.user.email === "admin@ebonidating.com" // Simplified check

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return <AdminDashboard />
}
