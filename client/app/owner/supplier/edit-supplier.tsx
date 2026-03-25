"use client"

import { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import SupplierForm from "./supplier-form"

const EditSupplier = ({ supplier, fetchSuppliers }: any) => {
  const [open, setOpen] = useState(false)

  const updateSupplier = async (id: string, supplierInfo: any) => {
    const { data } = await axios.put(
      `http://localhost:8080/api/suppliers/${id}`,
      supplierInfo
    )
    return data
  }

  const handleSubmit = async (values: any, { resetForm, setSubmitting }: any) => {
    try {
      setSubmitting(true)
      const data = await updateSupplier(supplier._id, values)

      toast.success(data.message || "Supplier updated successfully")

      // Wait for table refresh
      await fetchSuppliers()
      resetForm()
      setOpen(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update supplier")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
          <DialogDescription>
            Update the supplier information below.
          </DialogDescription>
        </DialogHeader>

        <SupplierForm
          initialValues={{
            name: supplier.name || "",
            phone: supplier.phone || "",
            email: supplier.email || "",
            address: supplier.address || "",
            taxNumber: supplier.taxNumber || "",
          }}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EditSupplier