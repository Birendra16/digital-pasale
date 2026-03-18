"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import axios from "axios"
import ReturnPurchase from "./return-purchase"

export default function ViewPurchase({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (!open) return
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:8080/api/purchases/${id}`)
      setData(res.data.purchase)
    }
    fetchData()
  }, [open, id])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Details</DialogTitle>
        </DialogHeader>

        {data && (
          <div className="space-y-2">
            
            {/* ✅ FIX HERE */}
            <div><b>Supplier:</b> {data.supplier?.name}</div>

            <div><b>Date:</b> {new Date(data.createdAt).toLocaleString()}</div>
            <div><b>Total:</b> {data.totalAmount}</div>

            <div className="space-y-1">
              <b>Items:</b>
              {data.items.map((item: any) => (
                <div key={item._id} className="text-sm">
                  {item.product?.name} - {item.quantity} × {item.costPrice} ({item.unit?.name})
                </div>
              ))}
            </div>

            <ReturnPurchase purchase={data} />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}