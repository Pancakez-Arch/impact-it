import EquipmentList from "@/components/equipment-list"
import { createServerClient } from "@/lib/supabase"

export const revalidate = 0

export default async function EquipmentPage() {
  const supabase = createServerClient()

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Fetch equipment with category information
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
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Equipment Inventory</h1>
          <p className="text-gray-600">Browse our collection of high-quality tech equipment available for rent</p>
        </div>

        {categories?.map((category) => {
          const categoryEquipment = equipment?.filter((item) => item.category_id === category.id && item.is_available)

          if (!categoryEquipment || categoryEquipment.length === 0) return null

          return (
            <div key={category.id} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{category.name}</h2>
              <EquipmentList items={categoryEquipment} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
