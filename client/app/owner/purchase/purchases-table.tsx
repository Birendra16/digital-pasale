"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import CreatePurchase from "./create-purchase"
import ViewPurchase from "./view-purchase"

export default function PurchasesTable() {
  const [purchases, setPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:8080/api/purchases")
      setPurchases(res.data.purchases || [])
    } catch (err) {
      console.error("Failed to fetch purchases", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchases()
  }, [])

  return (
    <div className="space-y-4">

      {/* Create Purchase */}
      <CreatePurchase onCreated={fetchPurchases} />

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Total Amount</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : purchases.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No purchases found
                </td>
              </tr>
            ) : (
              purchases.map((p) => (
                <tr key={p._id} className="border-t">

                  {/* ✅ FIXED */}
                  <td className="p-3">{p.supplierName}</td>

                  <td className="p-3">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>

                  {/* 🔥 Show item count */}
                  <td className="p-3">
                    {p.items?.length || 0} items
                  </td>

                  {/* 🔥 Format currency */}
                  <td className="p-3 font-medium">
                    Rs. {p.totalAmount?.toLocaleString()}
                  </td>

                  <td className="p-3">
                    <ViewPurchase id={p._id} />
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}