"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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

interface CreateProductPayload {
  name: string
  sku: string
  baseUnit: string
  units: {
    unit: string
    conversionToBase: number
    sellingPrice?: number
    costPrice?: number
  }[]
}

interface CreateProductsProps {
  createProduct: (payload: CreateProductPayload) => Promise<void>
}

export default function CreateProducts({ createProduct }: CreateProductsProps) {
  const [units, setUnits] = useState<Unit[]>([])
  const [loadingUnits, setLoadingUnits] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [baseUnit, setBaseUnit] = useState("")
  const [sellingPrice, setSellingPrice] = useState("")
  const [costPrice, setCostPrice] = useState("")

  const [showUnitForm, setShowUnitForm] = useState(false)
  const [unitName, setUnitName] = useState("")
  const [unitSymbol, setUnitSymbol] = useState("")

  // Fetch units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoadingUnits(true)
        const res = await axios.get("http://localhost:8080/api/units")
        setUnits(res.data.units)
      } catch (error) {
        toast("Failed to load units")
      } finally {
        setLoadingUnits(false)
      }
    }

    fetchUnits()
  }, [])

  // Create unit
  const createUnit = async () => {
    if (!unitName || !unitSymbol) {
      toast("Unit name and symbol are required")
      return
    }

    try {
      const { data } = await axios.post("http://localhost:8080/api/units", {
        name: unitName,
        symbol: unitSymbol,
      })

      setUnits(prev => [...prev, data.unit])
      setBaseUnit(data.unit._id)

      setUnitName("")
      setUnitSymbol("")
      setShowUnitForm(false)

      toast("Unit created")
    } catch {
      toast("Failed to create unit")
    }
  }

  // Submit product
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!baseUnit) {
      toast("Please select a base unit")
      return
    }

    const payload: CreateProductPayload = {
      name,
      sku,
      baseUnit,
      units: [
        {
          unit: baseUnit,
          conversionToBase: 1,
          sellingPrice: sellingPrice === "" ? undefined : Number(sellingPrice),
          costPrice: costPrice === "" ? undefined : Number(costPrice),
        },
      ],
    }

    try {
      setSubmitting(true)
      await createProduct(payload)

      toast("Product created Successfully !")

      resetForm()
    } catch {
      toast("Failed to create product")
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setName("")
    setSku("")
    setBaseUnit("")
    setSellingPrice("")
    setCostPrice("")
    setShowUnitForm(false)
    setUnitName("")
    setUnitSymbol("")
  }

  return (
    <Dialog onOpenChange={open => !open && resetForm()}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Enter product details</DialogDescription>
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
              <div className="flex gap-2">
                <select
                  className="w-full border rounded h-9 px-2"
                  value={baseUnit}
                  onChange={e => setBaseUnit(e.target.value)}
                  disabled={loadingUnits}
                  required
                >
                  <option value="">
                    {loadingUnits ? "Loading units..." : "Select Unit"}
                  </option>
                  {units.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUnitForm(v => !v)}
                >
                  + Add Unit
                </Button>
              </div>
            </div>

            {showUnitForm && (
              <div className="border rounded p-3 space-y-2 bg-gray-50">
                <div className="flex flex-col gap-1">
                  <Label>Unit Name</Label>
                  <Input
                    placeholder="Packet"
                    value={unitName}
                    onChange={e => setUnitName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label>Symbol</Label>
                  <Input
                    placeholder="pkt"
                    value={unitSymbol}
                    onChange={e => setUnitSymbol(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={createUnit}>
                    Save Unit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowUnitForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <Label>Selling Price</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={sellingPrice}
                onChange={e => {
                  const val = e.target.value
                  if (val === "" || Number(val) >= 0) setSellingPrice(val)
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Cost Price</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={costPrice}
                onChange={e => {
                  const val = e.target.value
                  if (val === "" || Number(val) >= 0) setCostPrice(val)
                }}
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