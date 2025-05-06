import { redirect, notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DeleteEmployeeForm from "@/components/delete-employee-form"

export const revalidate = 0

export default async function DeleteEmployeePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/auth/sign-in?redirect=/admin/employees/${params.id}/delete`)
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
          <h1 className="text-3xl font-bold mb-2">Delete Employee</h1>
          <p className="text-gray-600">Permanently remove this team member</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Confirm Deletion</CardTitle>
            <CardDescription>
              Are you sure you want to delete {employee.name}? This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {employee.name}
              </p>
              <p>
                <span className="font-medium">Title:</span> {employee.title}
              </p>
              {employee.email && (
                <p>
                  <span className="font-medium">Email:</span> {employee.email}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/admin/employees">Cancel</Link>
            </Button>
            <DeleteEmployeeForm employeeId={employee.id} />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
