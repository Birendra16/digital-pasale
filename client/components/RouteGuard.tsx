"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RouteGuard = ({ children, allowedRoles }: RouteGuardProps) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Check localStorage for USER
      const userStr = localStorage.getItem("USER");
      const token = localStorage.getItem("TOKEN");

      if (!userStr || !token) {
        toast.error("Please login first");
        router.push("/login");
        return;
      }

      try {
        const user = JSON.parse(userStr);

        // Check status first
        if (user.status !== "ACTIVE") {
          toast.error("Account pending approval");
          router.push("/pending");
          return;
        }

        // Check role
        if (!allowedRoles.includes(user.role)) {
          toast.error("Unauthorized access");
          // Redirect based on current role
          if (user.role === "ADMIN") {
            router.push("/admin");
          } else if (user.role === "OWNER") {
            router.push("/owner/dashboard");
          } else {
            router.push("/login");
          }
          return;
        }

        setAuthorized(true);
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [allowedRoles, router]);

  // Show nothing while checking (or a spinner/loader if you want)
  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};
