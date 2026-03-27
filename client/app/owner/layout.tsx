import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./components/app-sidebar";
import { RouteGuard } from "@/components/RouteGuard";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["OWNER", "ADMIN", "STAFF"]}>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main content */}
          <main className="flex-1 min-w-0 overflow-auto p-4">
            <SidebarTrigger />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </RouteGuard>
  );
}