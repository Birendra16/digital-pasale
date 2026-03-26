"use client"

import { useState, useEffect, useRef, Fragment } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
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

interface PurchaseItem {
  productName: string
  sku: string
  buyingUnit: string
  subUnit: string
  unitCapacity: string
  buyingQuantity: string
  costPricePerUnit: string
}

export default function CreatePurchase({ onCreated }: CreatePurchaseProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [units, setUnits] = useState<any[]>([])
  const [subunits, setSubUnits] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])

  const [loadingUnits, setLoadingUnits] = useState(true)
  const [loadingSubUnits, setLoadingSubUnits] = useState(true)
  const [loadingSuppliers, setLoadingSuppliers] = useState(true)

  const [supplierId, setSupplierId] = useState("")
  const [items, setItems] = useState<PurchaseItem[]>([
    {
      productName: "",
      sku: "",
      buyingUnit: "",
      subUnit: "",
      unitCapacity: "",
      buyingQuantity: "",
      costPricePerUnit: "",
    },
  ])

  const [activeIndex, setActiveIndex] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const resetForm = () => {
    setSupplierId("")
    setItems([
      {
        productName: "",
        sku: "",
        buyingUnit: "",
        subUnit: "",
        unitCapacity: "",
        buyingQuantity: "",
        costPricePerUnit: "",
      },
    ])
    setActiveIndex(0)
  }

  // ================= FETCH =================
  const fetchSuppliers = async () => {
    setLoadingSuppliers(true)
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/suppliers`)
      setSuppliers(res.data.suppliers || [])
    } catch {
      toast.error("Failed to load suppliers")
      setSuppliers([])
    } finally {
      setLoadingSuppliers(false)
    }
  }

  const fetchUnits = async () => {
    setLoadingUnits(true)
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/units`)
      setUnits(res.data.units || [])
    } catch {
      toast.error("Failed to load units")
      setUnits([])
    } finally {
      setLoadingUnits(false)
    }
  }

  const fetchSubUnits = async () => {
    setLoadingSubUnits(true)
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/subunits`)
      setSubUnits(res.data.subUnits || [])
    } catch {
      toast.error("Failed to load subunits")
      setSubUnits([])
    } finally {
      setLoadingSubUnits(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
    fetchUnits()
    fetchSubUnits()
  }, [])

  // ================= ITEM HANDLERS =================
  const updateItem = (index: number, field: keyof PurchaseItem, value: string) => {
    const updated = [...items]
    if (field === "sku") value = value.toUpperCase().trim()
    updated[index][field] = value
    setItems(updated)
  }

  const addItem = () => {
    const newItems = [
      ...items,
      {
        productName: "",
        sku: "",
        buyingUnit: "",
        subUnit: "",
        unitCapacity: "",
        buyingQuantity: "",
        costPricePerUnit: "",
      },
    ]
    setItems(newItems)
    const newIndex = newItems.length - 1
    setActiveIndex(newIndex)

    setTimeout(() => {
      inputRefs.current[newIndex]?.focus()
      const itemElement = inputRefs.current[newIndex]?.closest("div.border")
      itemElement?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, 100)
  }

  const removeItem = (index: number) => {
    if (items.length === 1) return
    const updated = items.filter((_, i) => i !== index)
    let newActiveIndex = activeIndex
    if (index === activeIndex) newActiveIndex = index > 0 ? index - 1 : 0
    else if (index < activeIndex) newActiveIndex = activeIndex - 1
    setItems(updated)
    setActiveIndex(newActiveIndex)
    setTimeout(() => {
      inputRefs.current[newActiveIndex]?.focus()
    }, 50)
  }

  // ================= CALC =================
  const grandTotal = items.reduce(
    (total, item) =>
      total + (Number(item.buyingQuantity) || 0) * (Number(item.costPricePerUnit) || 0),
    0
  )

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (submitting) return
    if (!supplierId || supplierId === "none") {
      toast.error("Select supplier")
      return
    }

    const skuSet = new Set<string>()
    for (const item of items) {
      const qty = Number(item.buyingQuantity) || 0
      const cap = Number(item.unitCapacity) || 0
      const cost = Number(item.costPricePerUnit) || 0

      if (!item.productName || !item.sku || !item.buyingUnit || !item.subUnit || item.buyingUnit === item.subUnit || qty <= 0 || cap <= 0 || cost <= 0) {
        toast.error("Fill all item fields correctly")
        return
      }

      if (skuSet.has(item.sku)) {
        toast.error(`Duplicate SKU found: ${item.sku}`)
        return
      }
      skuSet.add(item.sku)
    }

    try {
      setSubmitting(true)
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/purchases`, {
        supplierId,
        items: items.map((item) => ({
          productName: item.productName,
          sku: item.sku,
          buyingUnit: item.buyingUnit,
          subUnit: item.subUnit,
          unitCapacity: Number(item.unitCapacity),
          buyingQuantity: Number(item.buyingQuantity),
          costPricePerUnit: Number(item.costPricePerUnit),
        })),
      })
      toast.success("Purchase created")
      resetForm()
      setOpen(false)
      onCreated && onCreated()
    } catch (error: any) {
      console.error("CREATE PURCHASE ERROR:", error)
      toast.error(error?.response?.data?.message || "Failed to create purchase")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (!v ? resetForm() : setOpen(v))}
    >
      <DialogTrigger asChild>
        <Button>Add Purchase</Button>
      </DialogTrigger>

      <DialogContent
        className="h-[90vh] flex flex-col"
        aria-describedby="create-purchase-dialog"
      >
        <DialogHeader>
          <DialogTitle>Create Purchase</DialogTitle>
          <DialogDescription>
            Record incoming stock from suppliers.
          </DialogDescription>
        </DialogHeader>

        <div
          id="create-purchase-dialog"
          className="flex-1 overflow-y-auto space-y-3 pr-2"
        >
          <div>
            <Label>Supplier</Label>
            {loadingSuppliers ? (
              <div className="flex justify-center p-4">Loading...</div>
            ) : (
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {items.map((item, index) => {
            const isActive = index === activeIndex
            const itemTotal =
              (Number(item.buyingQuantity) || 0) *
              (Number(item.costPricePerUnit) || 0)

            const skuDuplicate = item.sku
              ? items.some((other, i) => i !== index && other.sku === item.sku)
              : false

            return (
              <div key={index} className="border rounded">
                <div
                  className={`flex justify-between items-center p-3 cursor-pointer transition ${
                    isActive ? "bg-blue-50" : "bg-gray-50"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div>
                    <p className="font-semibold">
                      {item.productName || `Item ${index + 1}`}
                    </p>
                    {!isActive && (
                      <p className="text-xs text-gray-500">
                        Qty: {item.buyingQuantity || 0} × Rs.{" "}
                        {item.costPricePerUnit || 0} | SKU: {item.sku || "-"}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">Rs. {itemTotal}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(index)
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                {isActive && (
                  <div className="p-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Input
                      ref={(el) => { inputRefs.current[index] = el }}
                      placeholder="Product Name"
                      value={item.productName}
                      onChange={(e) =>
                        updateItem(index, "productName", e.target.value)
                      }
                    />
                    <Input
                      placeholder="SKU (e.g., OLV-ORG-1L)"
                      value={item.sku}
                      onChange={(e) => updateItem(index, "sku", e.target.value)}
                    />
                    {skuDuplicate && (
                      <p className="text-red-500 text-sm">
                        This SKU is already added in another item!
                      </p>
                    )}

                    <Select
                      value={item.buyingUnit}
                      onValueChange={(v) => updateItem(index, "buyingUnit", v)}
                      disabled={loadingUnits}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={loadingUnits ? "Loading units..." : "Buying Unit"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((u) => (
                          <SelectItem key={u._id} value={u._id}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={item.subUnit}
                      onValueChange={(v) => updateItem(index, "subUnit", v)}
                      disabled={loadingSubUnits}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={loadingSubUnits ? "Loading subunits..." : "Sub Unit"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {subunits.map((su) => (
                          <SelectItem key={su._id} value={su._id}>
                            {su.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      placeholder="Buying Unit Capacity"
                      value={item.unitCapacity}
                      min={0}
                      onChange={(e) => updateItem(index, "unitCapacity", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={item.buyingQuantity}
                      min={0}
                      onChange={(e) => updateItem(index, "buyingQuantity", e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Cost per Unit"
                      value={item.costPricePerUnit}
                      min={0}
                      onChange={(e) =>
                        updateItem(index, "costPricePerUnit", e.target.value)
                      }
                    />

                    <div className="flex justify-between text-sm font-medium">
                      <span>Item Total</span>
                      <span>Rs. {itemTotal}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="border-t pt-3 space-y-3 bg-white">
          <Button variant="outline" onClick={addItem} className="w-full">
            + Add Another Item
          </Button>

          <div className="flex justify-between text-lg font-semibold">
            <span>Grand Total</span>
            <span>Rs. {grandTotal}</span>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                submitting ||
                items.some(
                  (item) =>
                    item.sku &&
                    items.filter((i) => i.sku === item.sku).length > 1
                )
              }
            >
              {submitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}