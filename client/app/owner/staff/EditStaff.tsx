"use client"

import { useState, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { toast } from "sonner"
import { Edit, UserPlus, Mail, Lock } from "lucide-react"

// shadcn/ui
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const EditStaffSchema = Yup.object().shape({
  name: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").nullable(),
});

interface EditStaffProps {
  staff: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpdated: () => void;
}

export default function EditStaff({ staff, open, setOpen, onUpdated }: EditStaffProps) {
  
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // If password is empty, don't send it to backend
      const payload = { ...values };
      if (!payload.password) delete payload.password;

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/${staff._id}`, payload);
      toast.success("Staff updated successfully");
      setOpen(false);
      onUpdated();
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Error updating staff");
    } finally {
      setSubmitting(false);
    }
  };

  if (!staff) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
        </DialogHeader>
        
        <Formik
          initialValues={{ 
            name: staff.name || "", 
            email: staff.email || "", 
            password: "" 
          }}
          validationSchema={EditStaffSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 pt-4">
              <div className="space-y-1">
                <Label htmlFor="edit-name">Full Name</Label>
                <div className="flex items-center border rounded-lg p-2">
                  <UserPlus className="w-5 h-5 text-gray-400 mr-2" />
                  <Field
                    as={Input}
                    name="name"
                    id="edit-name"
                    placeholder="Staff Name"
                    className="border-none focus-visible:ring-0 shadow-none"
                  />
                </div>
                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-email">Email Address</Label>
                <div className="flex items-center border rounded-lg p-2">
                  <Mail className="w-5 h-5 text-gray-400 mr-2" />
                  <Field
                    as={Input}
                    name="email"
                    id="edit-email"
                    type="email"
                    placeholder="staff@example.com"
                    className="border-none focus-visible:ring-0 shadow-none"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="edit-password">Password (Leave blank to keep current)</Label>
                <div className="flex items-center border rounded-lg p-2">
                  <Lock className="w-5 h-5 text-gray-400 mr-2" />
                  <Field
                    as={Input}
                    name="password"
                    id="edit-password"
                    type="password"
                    placeholder="Enter new password"
                    className="border-none focus-visible:ring-0 shadow-none"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Staff Account"}
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
