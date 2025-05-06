import { createServerClient } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const revalidate = 0

export default async function EquipmentDetailPage({ params }: { params: { id: string } }) {
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

  // Get similar equipment from the same category
  const { data: similarEquipment } = await supabase
    .from("equipment")
    .select(`
      *,
      categories(*)
    `)
    .eq("category_id", equipment.category_id)
    .neq("id", equipment.id)
    .limit(3)

  return (
    <div className="min-h-screen py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/equipment" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Equipment</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square relative rounded-xl overflow-hidden">
            <Image
              src={equipment.image_url || "/placeholder.svg?height=600&width=600"}
              alt={equipment.model}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">
                {equipment.categories.name} / {equipment.type}
              </p>
              <h1 className="text-3xl font-bold mb-4">{equipment.model}</h1>
              <p className="text-gray-700 mb-6">{equipment.description}</p>

              <div className="flex items-center gap-4 mb-8">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-500">Daily Rate</p>
                  <p className="text-2xl font-bold">${equipment.daily_rate.toFixed(2)}</p>
                </div>

                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-medium ${equipment.is_available ? "text-green-600" : "text-red-600"}`}>
                    {equipment.is_available ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>

              {equipment.is_available ? (
                <Button size="lg" className="w-full md:w-auto" asChild>
                  <Link href={`/equipment/${equipment.id}/book`}>Book Now</Link>
                </Button>
              ) : (
                <Button size="lg" className="w-full md:w-auto" disabled>
                  Currently Unavailable
                </Button>
              )}
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Equipment Details</h2>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span>{equipment.categories.name}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span>{equipment.type}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Model:</span>
                  <span>{equipment.model}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500">Daily Rate:</span>
                  <span>${equipment.daily_rate.toFixed(2)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {similarEquipment && similarEquipment.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Equipment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarEquipment.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video relative">
                    <Image
                      src={item.image_url || "/placeholder.svg?height=200&width=300"}
                      alt={item.model}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{item.type}</p>
                      <h3 className="text-xl font-bold mb-2">{item.model}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                      <p className="text-lg font-bold mb-4">${item.daily_rate.toFixed(2)} / day</p>
                      <Button asChild className="w-full">
                        <Link href={`/equipment/${item.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
