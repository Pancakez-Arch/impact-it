"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, User, LogOut, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut, isAdmin } = useAuth()

  return (
    <header className="py-4 px-6 md:px-12 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold">
        TechRent
      </Link>

      {/* Mobile menu button */}
      <button
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/" className="hover:text-gray-600 transition-colors">
          Home
        </Link>
        <Link href="/equipment" className="hover:text-gray-600 transition-colors">
          Equipment
        </Link>
        <Link href="/employees" className="hover:text-gray-600 transition-colors">
          Employees
        </Link>
        {isAdmin && (
          <Link href="/admin" className="hover:text-gray-600 transition-colors">
            Admin
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-4">
            <Link href="/bookings">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-4">
                  <User className="h-4 w-4 mr-2" />
                  {user.email?.split("@")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bookings">My Bookings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
          </div>
        )}
      </nav>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#f5f2eb] p-6 shadow-md z-50">
          <nav className="flex flex-col gap-4">
            <Link href="/" className="hover:text-gray-600 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link
              href="/equipment"
              className="hover:text-gray-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Equipment
            </Link>
            <Link
              href="/employees"
              className="hover:text-gray-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Employees
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="hover:text-gray-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            {user ? (
              <>
                <Link
                  href="/bookings"
                  className="hover:text-gray-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <Link
                  href="/profile"
                  className="hover:text-gray-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    signOut()
                    setIsMenuOpen(false)
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Button variant="outline" asChild>
                  <Link href="/auth/sign-in" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
