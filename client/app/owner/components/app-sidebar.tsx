import { BarChart3, Boxes, FileBarChart, Home, Package, UserCog, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/owner",
    icon: Home,
  },
  {
    title: "Products",
    url: "/owner/product",
    icon: Package,
  },
  {
    title: "Inventory",
    url: "/owner/inventory",
    icon: Boxes,
  },
  {
    title: "Customers",
    url: "/owner/customer",
    icon: Users,
  },
  {
    title: "Sales",
    url: "/owner/sales",
    icon: BarChart3,
  },
  {
    title: "Staff",
    url: "/owner/user",
    icon: UserCog,
  },
  {
    title: "Reports",
    url: "/owner/reports",
    icon: FileBarChart,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Digital Pasale</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}