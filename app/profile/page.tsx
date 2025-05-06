import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import ProfileForm from "@/components/profile-form"

export const revalidate = 0

export default async function ProfilePage() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/sign-in?redirect=/profile")
  }

  return (
    <div className="min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-gray-600">Manage your account settings</p>
        </div>

        <ProfileForm user={session.user} />
      </div>
    </div>
  )
}
