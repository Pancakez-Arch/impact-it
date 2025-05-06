import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import EmployeeForm from "@/components/employee-form"

export const revalidate = 0

export default async function NewEmployeePage() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/sign-in?redirect=/admin/employees/new")
  }

  // Check if user is admin
  const { data: userRole } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).single()

  if (!userRole || userRole.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Add New Employee</h1>
          <p className="text-gray-600">Create a new team member profile</p>
        </div>

        <EmployeeForm />
      </div>
    </div>
  )
}
