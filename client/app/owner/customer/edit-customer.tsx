"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { toast } from "sonner"

interface Customer {
  _id: string
  name: string
  shopName?: string
  panNumber?: string
  phone: string
  email?: string
  address: string
  customerType: "retail" | "wholesale" | "vip"
  creditLimit?: number
}

interface EditCustomerProps {
  customer: Customer
  editCustomer: (id: string, data: any) => Promise<void>
}

export default function EditCustomer({ customer, editCustomer }: EditCustomerProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone must be exactly 10 digits")
      .required("Phone is required"),
    address: Yup.string().required("Address is required"),
    shopName: Yup.string(),
    panNumber: Yup.string().max(9, "PAN cannot exceed 9 characters"),
    email: Yup.string().email("Invalid email format"),
    customerType: Yup.mixed().oneOf(["retail", "wholesale", "vip"]).required(),
    creditLimit: Yup.number().min(0, "Credit limit cannot be negative"),
  })

  const initialValues = {
    name: customer.name,
    phone: customer.phone,
    address: customer.address,
    shopName: customer.shopName || "",
    panNumber: customer.panNumber || "",
    email: customer.email || "",
    customerType: customer.customerType,
    creditLimit: customer.creditLimit || 0,
  }

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setSubmitting(true)
      await editCustomer(customer._id, values)
      toast.success("Customer updated successfully")
      setOpen(false)
    } catch (err: any) {
      if (err?.response?.status !== 403) toast.error(err.response?.data?.message || "Failed to update customer")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>Update the fields below to modify customer details.</DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <Label>Name *</Label>
                  <Field name="name" as={Input} />
                  <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <Label>Phone *</Label>
                  <Field
                    name="phone"
                    as={Input}
                    maxLength={10}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10)
                      setFieldValue("phone", val)
                    }}
                  />
                  <ErrorMessage name="phone" component="p" className="text-red-500 text-sm" />
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1">
                  <Label>Address *</Label>
                  <Field name="address" as={Input} />
                  <ErrorMessage name="address" component="p" className="text-red-500 text-sm" />
                </div>

                {/* Shop Name */}
                <div className="flex flex-col gap-1">
                  <Label>Shop Name</Label>
                  <Field name="shopName" as={Input} />
                  <ErrorMessage name="shopName" component="p" className="text-red-500 text-sm" />
                </div>

                {/* PAN Number */}
                <div className="flex flex-col gap-1">
                  <Label>PAN Number</Label>
                  <Field name="panNumber" as={Input} maxLength={9} />
                  <ErrorMessage name="panNumber" component="p" className="text-red-500 text-sm" />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <Label>Email</Label>
                  <Field name="email" as={Input} type="email" />
                  <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
                </div>

                {/* Customer Type */}
                <div className="flex flex-col gap-1">
                  <Label>Customer Type</Label>
                  <Select
                    value={values.customerType}
                    onValueChange={(v) => setFieldValue("customerType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage name="customerType" component="p" className="text-red-500 text-sm" />
                </div>

                {/* Credit Limit */}
                <div className="flex flex-col gap-1">
                  <Label>Credit Limit</Label>
                  <Field
                    name="creditLimit"
                    as={Input}
                    type="number"
                    min={0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const val = Number(e.target.value)
                      setFieldValue("creditLimit", val < 0 ? 0 : val)
                    }}
                  />
                  <ErrorMessage name="creditLimit" component="p" className="text-red-500 text-sm" />
                </div>
              </div>

              <DialogFooter className="flex flex-col md:flex-row gap-2 mt-4 justify-end">
                <DialogClose asChild>
                  <Button variant="outline" disabled={submitting}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}