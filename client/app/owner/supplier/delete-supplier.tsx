"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

const DeleteSupplier = ({ id, fetchSuppliers }: any) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const deleteSupplier = async (supplierId: string) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/api/suppliers/${supplierId}`
      )
      return data
    } catch (err) {
      throw err
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)

      const data = await deleteSupplier(id)

      toast.success(data.message || "Supplier deleted successfully")

      await fetchSuppliers()
      setOpen(false)
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to delete supplier"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          This action cannot be undone. This will permanently delete the supplier.
        </p>

        <DialogFooter className="mt-4 flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteSupplier