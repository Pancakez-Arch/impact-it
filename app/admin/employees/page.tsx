import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Pencil, Trash } from "lucide-react"

export const revalidate = 0

export default async function AdminEmployeesPage() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/sign-in?redirect=/admin/employees")
  }

  // Check if user is admin
  const { data: userRole } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).single()

  if (!userRole || userRole.role !== "admin") {
    redirect("/")
  }

  // Fetch all employees
  const { data: employees } = await supabase.from("employees").select("*").order("name")

  return (
    <div className="min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Employee Management</h1>
            <p className="text-gray-600">Add, edit, or remove team members</p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/admin/employees/new">Add Employee</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {employees?.map((employee) => (
            <div key={employee.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="aspect-video relative">
                <Image
                  src={employee.image_url || "/placeholder.svg?height=200&width=300"}
                  alt={employee.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{employee.name}</h3>
                <p className="text-gray-600 mb-4">{employee.title}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">{employee.email}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="p-0 w-8 h-8" asChild>
                      <Link href={`/admin/employees/${employee.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="p-0 w-8 h-8 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                      asChild
                    >
                      <Link href={`/admin/employees/${employee.id}/delete`}>
                        <Trash className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!employees || employees.length === 0) && (
            <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-medium mb-2">No employees found</h2>
              <p className="text-gray-600 mb-6">Add team members to display them on your website.</p>
              <Button asChild>
                <Link href="/admin/employees/new">Add Employee</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
