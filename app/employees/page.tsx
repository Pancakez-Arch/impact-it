import EmployeeCarousel from "@/components/employee-carousel"
import { createServerClient } from "@/lib/supabase"

export const revalidate = 0

export default async function EmployeesPage() {
  const supabase = createServerClient()

  // Fetch employees from the database
  const { data: employees } = await supabase.from("employees").select("*").order("id")

  return (
    <div className="min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Our Team</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet the dedicated professionals who ensure you get the best equipment and support for your projects.
          </p>
        </div>

        {employees && employees.length > 0 ? (
          <EmployeeCarousel employees={employees} />
        ) : (
          <div className="text-center py-12">
            <p>Loading team members...</p>
          </div>
        )}
      </div>
    </div>
  )
}
