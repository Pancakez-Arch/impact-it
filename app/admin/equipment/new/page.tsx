import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import EquipmentForm from "@/components/equipment-form"

export const revalidate = 0

export default async function NewEquipmentPage() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/sign-in?redirect=/admin/equipment/new")
  }

  // Check if user is admin
  const { data: userRole } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).single()

  if (!userRole || userRole.role !== "admin") {
    redirect("/")
  }

  // Fetch all categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Add New Equipment</h1>
          <p className="text-gray-600">Create a new equipment item for rental</p>
        </div>

        <EquipmentForm categories={categories || []} />
      </div>
    </div>
  )
}
