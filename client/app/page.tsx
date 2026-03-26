import { ShoppingCart, Users, Box, BarChart2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black font-sans">
      {/* Navbar */}
      <Navbar/>
      {/* Hero Section with Grocery Background */}
      <main
        className="mt-15 mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-34 text-center sm:text-left
                   bg-cover bg-center relative"
        style={{ backgroundImage: "url('/grocery.jpg')" }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex flex-col items-center sm:items-start">
          <h1 className="text-5xl font-bold text-white sm:text-6xl">
            Digital Pasale
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">
            The ultimate Wholesale Grocery Management System — manage inventory, sales, and analytics all in one platform.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-black/50 hover:bg-white/10"
              >
                Login
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section
        id="features"
        className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <ShoppingCart className="h-12 w-12 text-foreground" />
          <h3 className="text-xl font-semibold text-black dark:text-white">Inventory</h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Keep track of your products, stock levels, and reorder alerts effortlessly.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
          <Users className="h-12 w-12 text-foreground" />
          <h3 className="text-xl font-semibold text-black dark:text-white">Customer Management</h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage wholesale clients, orders, and communication in one dashboard.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
          <Box className="h-12 w-12 text-foreground" />
          <h3 className="text-xl font-semibold text-black dark:text-white">Orders</h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Track purchase orders, shipments, and deliveries seamlessly.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 text-center">
          <BarChart2 className="h-12 w-12 text-foreground" />
          <h3 className="text-xl font-semibold text-black dark:text-white">Analytics</h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Visualize sales trends, stock insights, and performance metrics in real-time.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-foreground dark:bg-zinc-900 py-20 text-center">
        <h2 className="text-4xl font-bold text-background">Start Managing Your Grocery Business Today!</h2>
        <p className="mt-4 text-lg text-background/80">
          Join hundreds of wholesalers who trust Digital Pasale.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="bg-background text-foreground hover:bg-white/30">
              Sign Up Free
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="border-background hover:bg-white/30">
              Login
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}