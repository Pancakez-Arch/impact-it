import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminBookingsList from "@/components/admin-bookings-list"
import AdminEquipmentList from "@/components/admin-equipment-list"

export const revalidate = 0

export default async function AdminPage() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/sign-in?redirect=/admin")
  }

  // Check if user is admin
  const { data: userRole } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).single()

  if (!userRole || userRole.role !== "admin") {
    redirect("/")
  }

  // Fetch all bookings with user and equipment details
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      equipment(*, categories(*))
    `)
    .order("created_at", { ascending: false })

  // Fetch all equipment with category details
  const { data: equipment } = await supabase
    .from("equipment")
    .select(`
      *,
      categories(*)
    `)
    .order("created_at", { ascending: false })

  // Fetch all categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Fetch all employees
  const { data: employees } = await supabase.from("employees").select("*")

  return (
    <div className="min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage equipment, bookings, and employees</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/admin/equipment/new">Add Equipment</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/employees">Manage Employees</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/windows-deployment">Deployment Guide</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <AdminBookingsList bookings={bookings || []} />
          </TabsContent>

          <TabsContent value="equipment">
            <AdminEquipmentList equipment={equipment || []} categories={categories || []} />
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{equipment?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Across {categories?.length || 0} categories</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bookings?.filter((b) => b.status === "approved").length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {bookings?.filter((b) => b.status === "pending").length || 0} pending approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employees?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    <Link href="/admin/employees" className="hover:underline">
                      Manage team
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
