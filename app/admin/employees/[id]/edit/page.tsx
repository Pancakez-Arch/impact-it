import { redirect, notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import EmployeeForm from "@/components/employee-form"

export const revalidate = 0

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/auth/sign-in?redirect=/admin/employees/${params.id}/edit`)
  }

  // Check if user is admin
  const { data: userRole } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).single()

  if (!userRole || userRole.role !== "admin") {
    redirect("/")
  }

  // Fetch employee data
  const { data: employee } = await supabase.from("employees").select("*").eq("id", params.id).single()

  if (!employee) {
    notFound()
  }

  return (
    <div className="min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Employee</h1>
          <p className="text-gray-600">Update team member information</p>
        </div>

        <EmployeeForm employee={employee} />
      </div>
    </div>
  )
}
