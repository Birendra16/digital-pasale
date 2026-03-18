"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import CreatePurchase from "./create-purchase"
import ViewPurchase from "./view-purchase"

export default function PurchasesTable() {
  const [purchases, setPurchases] = useState<any[]>([])

  const fetchPurchases = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/purchases")
      setPurchases(res.data.purchases)
    } catch {
      console.error("Failed to fetch purchases")
    }
  }

  useEffect(() => { fetchPurchases() }, [])

  return (
    <div className="space-y-4">
      <CreatePurchase onCreated={fetchPurchases} />

      <table className="w-full border rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2">Supplier</th>
            <th>Date</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map(p => (
            <tr key={p._id} className="border-b">
              
              {/* ✅ FIX HERE */}
              <td className="p-2">{p.supplier?.name}</td>

              <td>{new Date(p.createdAt).toLocaleString()}</td>
              <td>{p.totalAmount}</td>
              <td><ViewPurchase id={p._id} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}