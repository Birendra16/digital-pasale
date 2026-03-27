"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { toast } from "sonner"
import { Plus, UserPlus, Mail, Lock } from "lucide-react"

// shadcn/ui
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const StaffSchema = Yup.object().shape({
  name: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export default function CreateStaff({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (values: any, { resetForm, setSubmitting }: any) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/staff`, values);
      toast.success("Staff created successfully");
      setOpen(false);
      resetForm();
      onCreated();
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Error creating staff");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>
        
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={StaffSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 pt-4">
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center border rounded-lg p-2">
                  <UserPlus className="w-5 h-5 text-gray-400 mr-2" />
                  <Field
                    as={Input}
                    name="name"
                    id="name"
                    placeholder="Staff Name"
                    className="border-none focus-visible:ring-0 shadow-none"
                  />
                </div>
                <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center border rounded-lg p-2">
                  <Mail className="w-5 h-5 text-gray-400 mr-2" />
                  <Field
                    as={Input}
                    name="email"
                    id="email"
                    type="email"
                    placeholder="staff@example.com"
                    className="border-none focus-visible:ring-0 shadow-none"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center border rounded-lg p-2">
                  <Lock className="w-5 h-5 text-gray-400 mr-2" />
                  <Field
                    as={Input}
                    name="password"
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    className="border-none focus-visible:ring-0 shadow-none"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Staff Account"}
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
