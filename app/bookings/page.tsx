import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"
import BookingsList from "@/components/bookings-list"

export const revalidate = 0

export default async function BookingsPage() {
  const supabase = createServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/sign-in?redirect=/bookings")
  }

  // Fetch user's bookings with equipment details
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      equipment(*, categories(*))
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your equipment rental bookings</p>
        </div>

        {bookings && bookings.length > 0 ? (
          <BookingsList bookings={bookings} />
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-medium mb-2">No bookings found</h2>
            <p className="text-gray-600 mb-6">You haven't made any equipment bookings yet.</p>
            <a href="/equipment" className="text-blue-600 hover:underline">
              Browse equipment to rent
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
