"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import Image from "next/image"
import { differenceInDays, format, isBefore, isWithinInterval } from "date-fns"

interface BookingFormProps {
  equipment: any
  existingBookings: { start_date: string; end_date: string }[]
}

export default function BookingForm({ equipment, existingBookings }: BookingFormProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({
    from: new Date(),
    to: undefined,
  })
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  // Convert existing bookings to Date objects
  const bookedDates = existingBookings.map((booking) => ({
    start: new Date(booking.start_date),
    end: new Date(booking.end_date),
  }))

  // Calculate total price
  const totalDays = dateRange.to ? differenceInDays(dateRange.to, dateRange.from) + 1 : 0
  const totalPrice = totalDays * equipment.daily_rate

  // Function to check if a date is already booked
  const isDateBooked = (date: Date) => {
    return bookedDates.some((booking) => isWithinInterval(date, { start: booking.start, end: booking.end }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book equipment",
        variant: "destructive",
      })
      router.push("/auth/sign-in")
      return
    }

    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Please select dates",
        description: "You need to select both start and end dates",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          equipment_id: equipment.id,
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString(),
          total_price: totalPrice,
          notes: notes,
          status: "pending",
        })
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Booking submitted!",
        description: "Your booking request has been submitted and is pending approval.",
      })

      router.push("/bookings")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while submitting your booking.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardContent className="p-6">
          <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
            <Image
              src={equipment.image_url || "/placeholder.svg?height=200&width=300"}
              alt={equipment.model}
              fill
              className="object-cover"
            />
          </div>

          <h2 className="text-xl font-bold mb-2">{equipment.model}</h2>
          <p className="text-sm text-gray-500 mb-4">{equipment.type}</p>

          <p className="text-gray-700 mb-4">{equipment.description}</p>

          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">${equipment.daily_rate.toFixed(2)} / day</p>
            <p className="text-sm text-gray-500">Category: {equipment.categories.name}</p>
          </div>
        </CardContent>
      </Card>

      <div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Select Dates</h3>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => setDateRange(range as { from: Date; to: Date | undefined })}
              disabled={(date) => isBefore(date, new Date()) || isDateBooked(date)}
              className="rounded-md border"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Booking Details</h3>
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <div className="flex justify-between">
                <span>Start Date:</span>
                <span>{dateRange.from ? format(dateRange.from, "PPP") : "Select a date"}</span>
              </div>
              <div className="flex justify-between">
                <span>End Date:</span>
                <span>{dateRange.to ? format(dateRange.to, "PPP") : "Select a date"}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>
                  {totalDays} day{totalDays !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Price:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Additional Notes</h3>
            <Textarea
              placeholder="Add any special requirements or notes for your booking"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || !dateRange.to}>
            {isSubmitting ? "Submitting..." : "Confirm Booking"}
          </Button>
        </form>
      </div>
    </div>
  )
}
