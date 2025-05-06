"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { Category } from "@/types/supabase"

interface AddEquipmentFormProps {
  categories: Category[]
  onSuccess?: () => void
}

export default function AddEquipmentForm({ categories, onSuccess }: AddEquipmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newEquipment, setNewEquipment] = useState({
    category_id: categories.length > 0 ? categories[0].id : 0,
    type: "",
    model: "",
    description: "",
    image_url: "/placeholder.svg?height=200&width=300",
    daily_rate: "49.99",
    is_available: true,
  })

  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewEquipment((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setNewEquipment((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const dataToSubmit = {
        ...newEquipment,
        category_id: Number(newEquipment.category_id),
        daily_rate: Number(newEquipment.daily_rate),
      }

      const { error } = await supabase.from("equipment").insert(dataToSubmit)

      if (error) {
        throw error
      }

      toast({
        title: "Equipment added",
        description: "The new equipment has been successfully added.",
      })

      // Reset form
      setNewEquipment({
        category_id: categories.length > 0 ? categories[0].id : 0,
        type: "",
        model: "",
        description: "",
        image_url: "/placeholder.svg?height=200&width=300",
        daily_rate: "49.99",
        is_available: true,
      })

      if (onSuccess) {
        onSuccess()
      }

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while adding the equipment.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            value={newEquipment.category_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <input
            type="text"
            id="type"
            name="type"
            value={newEquipment.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            required
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={newEquipment.model}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            required
          />
        </div>

        <div>
          <label htmlFor="daily_rate" className="block text-sm font-medium text-gray-700 mb-1">
            Daily Rate ($)
          </label>
          <input
            type="number"
            id="daily_rate"
            name="daily_rate"
            value={newEquipment.daily_rate}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={newEquipment.image_url}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newEquipment.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_available"
            name="is_available"
            checked={newEquipment.is_available}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="is_available" className="ml-2 block text-sm text-gray-700">
            Available for booking
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Equipment"}
        </Button>
      </div>
    </form>
  )
}
