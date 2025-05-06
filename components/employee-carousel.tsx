"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Employee {
  id: number
  name: string
  title: string
  image_url?: string
  bio?: string
}

interface EmployeeCarouselProps {
  employees: Employee[]
}

export default function EmployeeCarousel({ employees }: EmployeeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? employees.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === employees.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }

  // Calculate which employees to show in the current view
  const getVisibleEmployees = () => {
    // For mobile, just show the current employee
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return [employees[currentIndex]]
    }

    // For desktop, show 3 employees centered around the current one
    const result = []
    for (let i = currentIndex - 1; i <= currentIndex + 1; i++) {
      const index = (i + employees.length) % employees.length
      result.push(employees[index])
    }
    return result
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Meet Our Specialists</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevious} aria-label="Previous employee">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNext} aria-label="Next employee">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="flex transition-transform duration-500 ease-in-out">
          {employees.map((employee, index) => (
            <div
              key={employee.id}
              className={`w-full md:w-1/3 flex-shrink-0 px-4 transition-opacity duration-500 ${
                index === currentIndex
                  ? "opacity-100 scale-100"
                  : (
                        index === currentIndex - 1 ||
                          index === currentIndex + 1 ||
                          (currentIndex === 0 && index === employees.length - 1) ||
                          (currentIndex === employees.length - 1 && index === 0)
                      )
                    ? "opacity-70 scale-95 hidden md:block"
                    : "opacity-0 scale-90 hidden"
              }`}
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="aspect-square relative">
                  <Image
                    src={employee.image_url || "/placeholder.svg?height=400&width=400"}
                    alt={employee.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">{employee.name}</h3>
                  <p className="text-gray-600 mb-2">{employee.title}</p>
                  {employee.bio && <p className="text-sm text-gray-500 line-clamp-3">{employee.bio}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8 gap-2">
        {employees.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-black" : "bg-gray-300"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
