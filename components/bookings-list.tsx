"use client"

import { useState } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

interface BookingsListProps {
  bookings: any[]
}

export default function BookingsList({ bookings }: BookingsListProps) {
  const [isLoading, setIsLoading] = useState<number | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCancelBooking = async (id: number) => {
    setIsLoading(id)

    try {
      const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id)

      if (error) {
        throw error
      }

      toast({
        title: "Booking cancelled",
        description: "Your booking has been successfully cancelled.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while cancelling your booking.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{booking.equipment.model}</CardTitle>
                <CardDescription>
                  {booking.equipment.type} - {booking.equipment.categories.name}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Booking ID:</span>
                <span>#{booking.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Start Date:</span>
                <span>{format(new Date(booking.start_date), "PPP")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">End Date:</span>
                <span>{format(new Date(booking.end_date), "PPP")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Price:</span>
                <span className="font-semibold">${booking.total_price.toFixed(2)}</span>
              </div>
              {booking.notes && (
                <div className="pt-2">
                  <p className="text-sm text-gray-500">Notes:</p>
                  <p className="text-sm mt-1">{booking.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {booking.status === "pending" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Cancel Booking
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will cancel your booking request. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, keep booking</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={isLoading === booking.id}
                    >
                      {isLoading === booking.id ? "Cancelling..." : "Yes, cancel booking"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
