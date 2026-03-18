"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { toast } from "sonner"

export default function ReturnPurchase({ purchase }: any) {
  const [quantities, setQuantities] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (id: string, value: string) => {
    setQuantities({ ...quantities, [id]: value })
  }

  const handleReturn = async () => {
    const items = purchase.items.map((item: any) => ({
      product: item.product._id,
      unit: item.unit._id,
      quantity: Number(quantities[item._id] || 0)
    })).filter((i: any) => i.quantity > 0)

    if (!items.length) {
      toast.error("Enter quantity to return")
      return
    }

    try {
      setLoading(true)
      await axios.post("http://localhost:8080/api/purchases/return", {
        purchaseId: purchase._id,
        items
      })
      toast.success("Return processed")
      setQuantities({})
    } catch {
      toast.error("Return failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2 mt-3">
      <b>Return Items:</b>
      {purchase.items.map((item: any) => (
        <div key={item._id} className="flex items-center gap-2">
          <div className="flex-1 text-sm">{item.product.name} ({item.unit.name})</div>
          <Input type="number" min={0} max={item.quantity} value={quantities[item._id] || ""} onChange={e => handleChange(item._id, e.target.value)} />
        </div>
      ))}
      <Button onClick={handleReturn} disabled={loading}>{loading ? "Processing..." : "Return Selected"}</Button>
    </div>
  )
}