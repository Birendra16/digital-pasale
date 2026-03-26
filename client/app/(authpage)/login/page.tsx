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
import { Mail, Lock } from "lucide-react";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        values
      );

      const user = res.data.user;
      const token = res.data.token;

      // ✅ SAVE AUTH DATA
      localStorage.setItem("USER", JSON.stringify(user));
      localStorage.setItem("TOKEN", token);

      toast.success("Login successful");

      // ✅ ROLE REDIRECT
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else if (user.role === "OWNER") {
        router.push("/owner/dashboard");
      }

      resetForm();

    } catch (err: any) {
      const message = err.response?.data?.msg;

      if (message === "Account pending approval") {
        toast.error(message);
        router.push("/pending");
      } else {
        toast.error(message || "Invalid credentials");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Digital Pasale
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Login to your account
          </p>
        </CardHeader>

        <CardContent>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">

                <div>
                  <Label>Email</Label>
                  <div className="flex items-center border rounded-lg p-2 mt-1">
                    <Mail className="w-5 h-5 text-gray-400 mr-2" />
                    <Field as={Input} name="email" />
                  </div>
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <Label>Password</Label>
                  <div className="flex items-center border rounded-lg p-2 mt-1">
                    <Lock className="w-5 h-5 text-gray-400 mr-2" />
                    <Field as={Input} type="password" name="password" />
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>

                <Button type="submit" className="w-full bg-gray-700">
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/signup" className="underline">
                    Sign Up
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