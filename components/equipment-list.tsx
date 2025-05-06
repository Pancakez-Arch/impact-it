"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface Category {
  id: number
  name: string
  description: string | null
}

interface EquipmentItem {
  id: number
  category_id: number
  type: string
  model: string
  description: string | null
  image_url: string | null
  daily_rate: number
  is_available: boolean
  categories: Category
}

interface EquipmentListProps {
  items: EquipmentItem[]
}

export default function EquipmentList({ items }: EquipmentListProps) {
  const router = useRouter()
  const { user } = useAuth()

  const handleRentClick = (id: number) => {
    if (!user) {
      router.push("/auth/sign-in?redirect=/equipment")
      return
    }

    router.push(`/equipment/${id}/book`)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
              <Button onClick={() => handleRentClick(item.id)} className="w-full">
                Rent Now
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
