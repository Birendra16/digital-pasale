"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Brand */}
        <span className="text-2xl font-bold">
          Digital Pasale
        </span>

        {/* Desktop Menu */}
        <NavigationMenu className="hidden sm:flex">
          <NavigationMenuList className="gap-6">
            <NavigationMenuItem>
              <a href="#" className="text-sm hover:text-foreground">
                Home
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#features" className="text-sm hover:text-foreground">
                Features
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#pricing" className="text-sm hover:text-foreground">
                Pricing
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <a href="#contact" className="text-sm hover:text-foreground">
                Contact
              </a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px]">
              <div className="mt-8 flex flex-col gap-6">
                <a href="#home" className="text-lg">Home</a>
                <a href="#features" className="text-lg">Features</a>
                <a href="#pricing" className="text-lg">Pricing</a>
                <a href="#contact" className="text-lg">Contact</a>

                <div className="flex flex-col gap-3 pt-6">
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  );
}