"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import OwnerDashboard from "./dashboard/OwnerDashboard";
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("USER");

    if (!user) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(user);

    if (parsed.role !== "OWNER") {
      router.push("/");
    }
  }, []);

  return <OwnerDashboard />;
}