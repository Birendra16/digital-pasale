"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// icons
import { User, Mail, Lock } from "lucide-react";

const SignupSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too Short!").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password too short").required("Password is required"),
});

export default function SignupPage() {
  const router = useRouter();

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        values
      );

      toast.success(res.data.msg);
      resetForm();

      // ✅ redirect to pending page
      router.push("/pending");

    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center `bg-gradient-to-br` from-indigo-50 to-purple-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Digital Pasale
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Create your account
          </p>
        </CardHeader>

        <CardContent>
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">

                {/* Name */}
                <div>
                  <Label>Name</Label>
                  <div className="flex items-center border rounded-lg p-2 mt-1 focus-within:ring-2 ring-indigo-400">
                    <User className="w-5 h-5 text-gray-400 mr-2" />
                    <Field as={Input} name="name" placeholder="John Doe" />
                  </div>
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <div className="flex items-center border rounded-lg p-2 mt-1 focus-within:ring-2 ring-indigo-400">
                    <Mail className="w-5 h-5 text-gray-400 mr-2" />
                    <Field as={Input} name="email" placeholder="john@example.com" />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Password */}
                <div>
                  <Label>Password</Label>
                  <div className="flex items-center border rounded-lg p-2 mt-1 focus-within:ring-2 ring-indigo-400">
                    <Lock className="w-5 h-5 text-gray-400 mr-2" />
                    <Field as={Input} type="password" name="password" placeholder="********" />
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gray-700 hover:bg-gray-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Sign Up"}
                </Button>

                {/* Link */}
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="underline text-gray-900">
                    Login
                  </Link>
                </p>

              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}