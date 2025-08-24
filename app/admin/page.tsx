import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  // This should now work with the type definitions
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome to the admin panel, {session.user.name || session.user.email}!</p>
      {/* Add your admin content here */}
    </div>
  )
}
