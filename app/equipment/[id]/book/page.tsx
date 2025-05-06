import { createServerClient } from "@/lib/supabase"
import { notFound } from "next/navigation"
import BookingForm from "@/components/booking-form"

export const revalidate = 0

export default async function BookEquipmentPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const { data: equipment } = await supabase
    .from("equipment")
    .select(`
      *,
      categories(*)
    `)
    .eq("id", params.id)
    .single()

  if (!equipment) {
    notFound()
  }

  // Get existing bookings for this equipment to check availability
  const { data: existingBookings } = await supabase
    .from("bookings")
    .select("start_date, end_date")
    .eq("equipment_id", equipment.id)
    .in("status", ["pending", "approved"])

  return (
    <div className="min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book {equipment.model}</h1>
          <p className="text-gray-600">Complete the form below to book this equipment</p>
        </div>

        <BookingForm equipment={equipment} existingBookings={existingBookings || []} />
      </div>
    </div>
  )
}
