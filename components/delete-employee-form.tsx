"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

interface DeleteEmployeeFormProps {
  employeeId: number
}

export default function DeleteEmployeeForm({ employeeId }: DeleteEmployeeFormProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const { error } = await supabase.from("employees").delete().eq("id", employeeId)

      if (error) {
        throw error
      }

      toast({
        title: "Employee deleted",
        description: "The employee has been successfully deleted.",
      })

      router.push("/admin/employees")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while deleting the employee.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? "Deleting..." : "Delete Employee"}
    </Button>
  )
}
