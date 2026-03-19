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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"
import axios from "axios"
import { toast } from "sonner"

interface CreatePurchaseProps {
  onCreated?: () => void
}

export default function CreatePurchase({ onCreated }: CreatePurchaseProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [units, setUnits] = useState<any[]>([])

  // 🔥 New states (based on schema)
  const [productName, setProductName] = useState("")
  const [supplierName, setSupplierName] = useState("")
  const [buyingUnit, setBuyingUnit] = useState("")
  const [subUnit, setSubUnit] = useState("")
  const [unitCapacity, setUnitCapacity] = useState("")
  const [buyingQuantity, setBuyingQuantity] = useState("")
  const [costPricePerUnit, setCostPricePerUnit] = useState("")

  const resetForm = () => {
    setProductName("")
    setSupplierName("")
    setBuyingUnit("")
    setSubUnit("")
    setUnitCapacity("")
    setBuyingQuantity("")
    setCostPricePerUnit("")
  }

  useEffect(() => {
    const fetchUnits = async () => {
      const res = await axios.get("http://localhost:8080/api/units")
      setUnits(res.data.units)
    }
    fetchUnits()
  }, [])

  const handleSubmit = async () => {
    const qty = Number(buyingQuantity)
    const cap = Number(unitCapacity)
    const cost = Number(costPricePerUnit)

    if (
      !productName ||
      !supplierName ||
      !buyingUnit ||
      !subUnit ||
      qty <= 0 ||
      cap <= 0 ||
      cost <= 0
    ) {
      toast.error("Please enter valid values")
      return
    }

    if (buyingUnit === subUnit) {
      toast.error("Buying unit and subunit cannot be same")
      return
    }

    try {
      setSubmitting(true)

      await axios.post("http://localhost:8080/api/purchases", {
        supplierName,
        items: [
          {
            productName,
            buyingUnit,
            subUnit,
            unitCapacity: cap,
            buyingQuantity: qty,
            costPricePerUnit: cost,
          },
        ],
      })

      toast.success("Purchase created")
      resetForm()
      setOpen(false)
      onCreated && onCreated()
    } catch (err) {
      console.error(err)
      toast.error("Failed to create purchase")
    } finally {
      setSubmitting(false)
    }
  }

  // 🔥 Live calculation
  const totalSubUnits =
    Number(buyingQuantity) * Number(unitCapacity) || 0

  const estimatedTotal =
    Number(buyingQuantity) * Number(costPricePerUnit) || 0

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button>Add Purchase</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Purchase</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">

          {/* Supplier */}
          <div>
            <Label>Supplier Name</Label>
            <Input
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
          </div>

          {/* Product */}
          <div>
            <Label>Product Name</Label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          {/* Buying Unit */}
          <div>
            <Label>Buying Unit</Label>
            <Select value={buyingUnit} onValueChange={setBuyingUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Select buying unit" />
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

          {/* Sub Unit */}
          <div>
            <Label>Sub Unit</Label>
            <Select value={subUnit} onValueChange={setSubUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Select sub unit" />
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

          {/* Capacity */}
          <div>
            <Label>1 Buying Unit = ? Sub Units</Label>
            <Input
              type="number"
              value={unitCapacity}
              onChange={(e) => setUnitCapacity(e.target.value)}
            />
          </div>

          {/* Quantity */}
          <div>
            <Label>Buying Quantity</Label>
            <Input
              type="number"
              value={buyingQuantity}
              onChange={(e) => setBuyingQuantity(e.target.value)}
            />
          </div>

          {/* Cost */}
          <div>
            <Label>Cost Price (per Buying Unit)</Label>
            <Input
              type="number"
              value={costPricePerUnit}
              onChange={(e) => setCostPricePerUnit(e.target.value)}
            />
          </div>

          {/* 🔥 Live Preview */}
          <div className="text-sm space-y-1 border-t pt-2">
            <div className="flex justify-between">
              <span>Total Sub Units</span>
              <span>{totalSubUnits}</span>
            </div>

            <div className="flex justify-between font-semibold">
              <span>Total Cost</span>
              <span>Rs. {estimatedTotal}</span>
            </div>
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}