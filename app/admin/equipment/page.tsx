import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import AddEquipmentForm from "@/components/add-equipment-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const revalidate = 0

export default async function AdminEquipmentPage() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/sign-in?redirect=/admin/equipment")
  }

  // Check if user is admin
  const { data: userRole } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).single()

  if (!userRole || userRole.role !== "admin") {
    redirect("/")
  }

  // Fetch all categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Fetch all equipment with category details
  const { data: equipment } = await supabase
    .from("equipment")
    .select(`
      *,
      categories(*)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Equipment Management</h1>
            <p className="text-gray-600">Add, edit, or remove equipment from your inventory</p>
          </div>
          <Button asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Equipment</h2>
          <AddEquipmentForm categories={categories || []} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Current Inventory ({equipment?.length || 0} items)</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Model</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Daily Rate</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipment?.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{item.id}</td>
                    <td className="py-3 px-4">{item.model}</td>
                    <td className="py-3 px-4">{item.type}</td>
                    <td className="py-3 px-4">{item.categories.name}</td>
                    <td className="py-3 px-4">${item.daily_rate.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.is_available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/equipment/${item.id}/edit`}>Edit</Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {equipment?.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No equipment found. Add some equipment to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
