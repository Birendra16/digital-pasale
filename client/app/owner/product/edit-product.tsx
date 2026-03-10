"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Unit {
  _id: string
  name: string
  symbol: string
}

interface Product {
  _id: string
  name: string
  sku: string
  baseUnit: { _id: string; name: string; symbol: string } | null
  units: { unit: string; sellingPrice: number; costPrice: number }[]
}

interface EditProductProps {
  product: Product
  editProduct: (id: string, data: any) => Promise<void>
}

export default function EditProduct({ product, editProduct }: EditProductProps) {
  const [units, setUnits] = useState<Unit[]>([])
  const [loadingUnits, setLoadingUnits] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Use safe fallback if baseUnit is null
  const [name, setName] = useState(product.name || "")
  const [sku, setSku] = useState(product.sku || "")
  const [baseUnit, setBaseUnit] = useState(product.baseUnit?._id || "")
  const [sellingPrice, setSellingPrice] = useState(product.units?.[0]?.sellingPrice || 0)
  const [costPrice, setCostPrice] = useState(product.units?.[0]?.costPrice || 0)

  // Fetch all units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoadingUnits(true)
        const res = await axios.get("http://localhost:8080/api/units")
        setUnits(res.data.units)
      } catch {
        toast.error("Failed to load units")
      } finally {
        setLoadingUnits(false)
      }
    }
    fetchUnits()
  }, [])

  const resetForm = () => {
    setName(product.name || "")
    setSku(product.sku || "")
    setBaseUnit(product.baseUnit?._id || "")
    setSellingPrice(product.units?.[0]?.sellingPrice || 0)
    setCostPrice(product.units?.[0]?.costPrice || 0)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!baseUnit) {
      toast.error("Please select a base unit")
      return
    }

    const payload = {
      name,
      sku,
      baseUnit,
      units: [
        {
          unit: baseUnit,
          conversionToBase: 1,
          sellingPrice: Number(sellingPrice),
          costPrice: Number(costPrice),
        },
      ],
    }

    try {
      setSubmitting(true)
      await editProduct(product._id, payload)
      toast.success("Product updated successfully")
    } catch {
      toast.error("Failed to update product")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog onOpenChange={open => !open && resetForm()}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="flex flex-col gap-1">
              <Label>SKU</Label>
              <Input value={sku} onChange={e => setSku(e.target.value)} required />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Base Unit</Label>
              <select
                className="w-full border rounded h-9 px-2"
                value={baseUnit}
                onChange={e => setBaseUnit(e.target.value)}
                disabled={loadingUnits}
                required
              >
                <option value="" disabled hidden>
                  {loadingUnits ? "Loading units..." : "Select Unit"}
                </option>
                {units.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Selling Price</Label>
              <Input
                type="number"
                min={0}
                step="1"
                value={sellingPrice}
                onChange={e => setSellingPrice(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Cost Price</Label>
              <Input
                type="number"
                min={0}
                step="1"
                value={costPrice}
                onChange={e => setCostPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={submitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}