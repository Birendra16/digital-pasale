"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import axios from "axios"
import { toast } from "sonner"

interface CreatePurchaseProps {
  onCreated?: () => void
}

export default function CreatePurchase({ onCreated }: CreatePurchaseProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])

  const [product, setProduct] = useState("")
  const [unit, setUnit] = useState("")
  const [supplier, setSupplier] = useState("")
  const [quantity, setQuantity] = useState("")
  const [costPrice, setCostPrice] = useState("")

  const resetForm = () => {
    setProduct("")
    setUnit("")
    setSupplier("")
    setQuantity("")
    setCostPrice("")
  }

  useEffect(() => {
    const fetchData = async () => {
      const p = await axios.get("http://localhost:8080/api/products")
      setProducts(p.data.products)
      const u = await axios.get("http://localhost:8080/api/units")
      setUnits(u.data.units)
      const s = await axios.get("http://localhost:8080/api/suppliers")
      setSuppliers(s.data.suppliers)
    }
    fetchData()
  }, [])

  const handleSubmit = async () => {
    const qty = Number(quantity)
    const cp = Number(costPrice)
    if (!product || !unit || !supplier || qty <= 0 || cp <= 0) {
      toast.error("Enter valid positive values")
      return
    }

    try {
      setSubmitting(true)
      await axios.post("http://localhost:8080/api/purchases", {
        supplier,
        items: [{ product, unit, quantity: qty, costPrice: cp }]
      })
      toast.success("Purchase created")
      resetForm()
      setOpen(false)
      onCreated && onCreated()
    } catch {
      toast.error("Failed to create purchase")
    } finally {
      setSubmitting(false)
    }
  }

  const estimatedTotal = Number(quantity) * Number(costPrice) || 0

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if(!v) resetForm() }}>
      <DialogTrigger asChild>
        <Button>Add Purchase</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Purchase</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Product</Label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
              <SelectContent>
                {products.map(p => <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
              <SelectContent>
                {units.map(u => <SelectItem key={u._id} value={u._id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Supplier</Label>
            <Select value={supplier} onValueChange={setSupplier}>
              <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
              <SelectContent>
                {suppliers.map(s => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Quantity</Label>
            <Input type="number" min={0} value={quantity} onChange={e => setQuantity(e.target.value)} />
          </div>

          <div>
            <Label>Cost Price</Label>
            <Input type="number" min={0} value={costPrice} onChange={e => setCostPrice(e.target.value)} />
          </div>

          <div className="flex justify-between font-semibold">
            <span>Estimated Total</span>
            <span>{estimatedTotal}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>{submitting ? "Saving..." : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}