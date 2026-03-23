"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import PurchasesTable from "./purchases-table"
import CreatePurchase from "./create-purchase"

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([])

  const fetchPurchases = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/purchases")
      setPurchases(res.data.purchases || [])
    } catch (error) {
      console.error("Failed to fetch purchases", error)
    }
  }

  useEffect(() => {
    fetchPurchases()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Purchases</h1>
      <p className="text-sm text-muted-foreground">
        Record incoming stock from suppliers. You can view all purchase details and process returns.
      </p>

      {/* Create Purchase Button */}
      <CreatePurchase onCreated={fetchPurchases} />

      {/* Purchases Table */}
      <PurchasesTable purchases={purchases} onRefresh={fetchPurchases} />
    </div>
  )
}