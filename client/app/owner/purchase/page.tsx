"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

const Purchases = () => {
  const [products, setProducts] = useState<any[]>([])
  const [product, setProduct] = useState("")
  const [unit, setUnit] = useState("")
  const [units, setUnits] = useState<any[]>([])
  const [quantity, setQuantity] = useState("")
  const [costPrice, setCostPrice] = useState("")
  const [supplier, setSupplier] = useState("")

  useEffect(() => {
    fetchProducts()
    fetchUnits()
  }, [])

  const fetchProducts = async () => {
    const { data } = await axios.get("http://localhost:8080/api/products")
    setProducts(data.products)
  }
  const fetchUnits = async () => {
    const { data } = await axios.get("http://localhost:8080/api/units")
    setUnits(data.units)
  }

  const handleSubmit = async () => {
    const qty = Number(quantity)
    const cp = Number(costPrice)

    if (
      !product ||
      !unit ||
      !supplier.trim() ||
      Number.isNaN(qty) ||
      Number.isNaN(cp) ||
      qty <= 0 ||
      cp <= 0
    ) {
      toast.error("Please enter valid positive values for all fields")
      return
    }

    await axios.post("http://localhost:8080/api/purchases", {
      supplier: supplier.trim(),
      items: [
        {
          product,
          unit,
          quantity: qty,
          costPrice: cp,
        },
      ],
    })
    toast.success("Purchase recorded")
  }

  const estimatedTotal = useMemo(() => {
    const qty = Number(quantity)
    const cp = Number(costPrice)
    if (Number.isNaN(qty) || Number.isNaN(cp) || qty <= 0 || cp <= 0) return 0
    return qty * cp
  }, [quantity, costPrice])
  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Purchase Stock</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Record incoming stock from suppliers. All fields are required.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium">Product</Label>
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium">Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u._id} value={u._id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium">Supplier</Label>
              <Input
                type="text"
                placeholder="Enter supplier name"
                value={supplier ?? ""}
                onChange={(e) => setSupplier(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium">Quantity</Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                min={0}
                step="1"
                value={quantity ?? ""}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-sm font-medium">Cost Price</Label>
              <Input
                type="number"
                placeholder="Enter cost price"
                min={0}
                step="1"
                value={costPrice ?? ""}
                onChange={(e) => setCostPrice(e.target.value)}
              />
            </div>

            <div className="flex flex-col justify-end text-sm text-muted-foreground">
              <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-muted/40">
                <span>Estimated total</span>
                <span className="font-semibold text-foreground">
                  {estimatedTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit}>Create Purchase</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Purchases