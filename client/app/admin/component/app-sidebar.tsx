"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart3, Boxes, Building2, Home, Package, Settings, ShoppingBasketIcon, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items
const items = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Approvals", url: "/admin/approvals", icon: Boxes },
//   { title: "Suppliers", url: "/owner/supplier", icon: Building2 },
//   { title: "Customers", url: "/owner/customer", icon: Users },
//   { title: "Sales", url: "/owner/sales", icon: BarChart3 },
//   { title: "Purchase", url: "/owner/purchase", icon: ShoppingBasketIcon },
//   { title: "Settings", url: "/owner/settings", icon: Settings },
];

export function AppSidebar() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}