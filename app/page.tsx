import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Play } from "lucide-react"
import { createServerClient } from "@/lib/supabase"

export const revalidate = 0

export default async function Home() {
  // Fetch featured equipment from the database
  const supabase = createServerClient()
  const { data: featuredEquipment } = await supabase
    .from("equipment")
    .select(`
      *,
      categories(*)
    `)
    .limit(2)
    .order("id", { ascending: false })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-lg font-medium">12 Years Experienced</span>
              <Star className="h-4 w-4" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Premium Tech Rental Solutions.</h1>
            <p className="text-gray-700 mb-8 max-w-md">
              We provide high-quality tech equipment rentals for businesses, events, and individuals. Our service is
              especially beneficial for projects where purchasing equipment isn't cost-effective.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/equipment">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full flex items-center gap-2">
                <Play className="h-4 w-4" />
                <span>How it works</span>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-square">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Tech equipment"
                width={600}
                height={600}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <p className="text-sm font-medium">Equipment Management</p>
              <ul className="text-xs mt-2">
                <li className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Laptops</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Cameras</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Audio</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="px-6 md:px-12 py-12 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-gray-500 mb-8">Over 500+ companies trust TechRent</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {["Google", "Microsoft", "Apple", "Amazon", "Meta"].map((company) => (
              <div key={company} className="text-gray-400 font-medium">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12">Our Rental Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Laptops & Computers", color: "bg-white" },
            { title: "Camera Equipment", color: "bg-yellow-100" },
            { title: "Audio Gear", color: "bg-orange-100" },
            { title: "Presentation Tools", color: "bg-blue-50" },
          ].map((service, index) => (
            <div key={index} className={`${service.color} p-6 rounded-xl hover:shadow-md transition-shadow`}>
              <div className="w-12 h-12 bg-gray-100 rounded-lg mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-4">High-quality equipment for your professional needs</p>
              <Link
                href="/equipment"
                className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                Learn More <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Approach Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-square">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Our approach"
                width={600}
                height={600}
                className="object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-8">Our Unique Approach</h2>
            <ul className="space-y-6">
              {[
                "Premium equipment with regular maintenance checks",
                "Flexible rental periods to suit your project timeline",
                "Technical support available throughout your rental period",
              ].map((point, index) => (
                <li key={index} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{point}</p>
                    <p className="text-gray-600 text-sm mt-1">
                      We ensure all equipment is in perfect working condition and ready for your needs.
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Featured Equipment Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Popular Equipment</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Our most requested items that help our clients achieve their goals
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredEquipment?.map((item) => (
              <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-video relative">
                  <Image
                    src={item.image_url || "/placeholder.svg?height=300&width=600"}
                    alt={item.model}
                    width={600}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{item.categories.name}</p>
                  <h3 className="text-xl font-bold mb-4">{item.model}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold">${item.daily_rate.toFixed(2)}/day</p>
                    <Link
                      href={`/equipment/${item.id}`}
                      className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      View Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
