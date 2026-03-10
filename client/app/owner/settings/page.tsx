"use client"
import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const modules = [
  { name: "Units", path: "/owner/settings/units" },
  { name: "Categories", path: "/owner/settings/categories" },
  { name: "Brands", path: "/owner/settings/brands" },
  { name: "Taxes", path: "/owner/settings/taxes" },
  { name: "Warehouses", path: "/owner/settings/warehouses" },
]

const Settings = () => {
  const router = useRouter()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <div
            key={mod.name}
            className="p-4 border rounded shadow hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <h2 className="text-lg font-semibold mb-2">{mod.name}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(mod.path)}
            >
              Manage {mod.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Settings