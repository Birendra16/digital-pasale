"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectTrigger, SelectContent, SelectValue, SelectItem
} from "@/components/ui/select"
import axios from "axios"
import { toast } from "sonner"

interface SaleItem {
  inventoryId: string
  productName: string
  sku: string
  unitCapacity: number
  unitQuantity: number | ""
  subUnitQuantity: number | ""
  sellingPricePerUnit: number | ""
  sellingPricePerSubUnit: number | ""
}

export default function CreateSale({ onCreated }: any) {
  const [open, setOpen] = useState(false)
  const [inventory, setInventory] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [customerId, setCustomerId] = useState("")
  const [paidAmount, setPaidAmount] = useState<number | "">("")
  const [items, setItems] = useState<SaleItem[]>([{
    inventoryId: "",
    productName: "",
    sku: "",
    unitCapacity: 1,
    unitQuantity: "",
    subUnitQuantity: "",
    sellingPricePerUnit: "",
    sellingPricePerSubUnit: "",
  }])

  const [activeIndex, setActiveIndex] = useState(0)
  const selectRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory`)
      .then(res => setInventory(res.data.products))
      .catch(() => toast.error("Failed to load inventory"))

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/customers`)
      .then(res => setCustomers(res.data.data))
      .catch(() => toast.error("Failed to load customers"))
  }, [])

  const updateItem = (i: number, field: keyof SaleItem, value: any) => {
    const updated = [...items]
    if (["sellingPricePerUnit", "sellingPricePerSubUnit", "unitQuantity", "subUnitQuantity"].includes(field)) {
      if (value === "" || isNaN(Number(value))) value = ""
      else value = Math.max(0, Number(value))
    }

    (updated[i] as any)[field] = value

    const item = updated[i]
    if (typeof item.unitQuantity === 'number' && typeof item.subUnitQuantity === 'number') {
      const totalSub = item.unitQuantity * item.unitCapacity + item.subUnitQuantity
      item.unitQuantity = Math.floor(totalSub / item.unitCapacity)
      item.subUnitQuantity = totalSub % item.unitCapacity
    }

    setItems(updated)
  }

  const addItem = () => {
    const newItem: SaleItem = {
      inventoryId: "",
      productName: "",
      sku: "",
      unitCapacity: 1,
      unitQuantity: "",
      subUnitQuantity: "",
      sellingPricePerUnit: "",
      sellingPricePerSubUnit: "",
    }
    const newItems = [...items, newItem]
    setItems(newItems)
    const newIndex = newItems.length - 1
    setActiveIndex(newIndex)
    setTimeout(() => {
      selectRefs.current[newIndex]?.focus()
      selectRefs.current[newIndex]?.closest("div.border")?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, 100)
  }

  const removeItem = (index: number) => {
    if (items.length === 1) return
    const updated = items.filter((_, i) => i !== index)
    let newActive = activeIndex
    if (index === activeIndex) newActive = index > 0 ? index - 1 : 0
    else if (index < activeIndex) newActive = activeIndex - 1
    setItems(updated)
    setActiveIndex(newActive)

    setTimeout(() => {
      selectRefs.current[newActive]?.focus()
    }, 50)
  }

  const grandTotal = items.reduce((total, item) => {
    const unit = typeof item.unitQuantity === 'number' ? item.unitQuantity : 0
    const sub = typeof item.subUnitQuantity === 'number' ? item.subUnitQuantity : 0
    const priceUnit = typeof item.sellingPricePerUnit === 'number' ? item.sellingPricePerUnit : 0
    const priceSub = typeof item.sellingPricePerSubUnit === 'number' ? item.sellingPricePerSubUnit : 0
    return total + unit * priceUnit + sub * priceSub
  }, 0)

  const dueAmount = Math.max(0, grandTotal - (typeof paidAmount === 'number' ? paidAmount : 0))

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    const skuSet = new Set<string>()

    for (const item of items) {
      if (!item.inventoryId || !item.sku) {
        toast.error("Select product and SKU for all items")
        return
      }

      if (skuSet.has(item.sku)) {
        toast.error(`Duplicate SKU found: ${item.sku}`)
        return
      }
      skuSet.add(item.sku)

      const unit = Number(item.unitQuantity) || 0
      const sub = Number(item.subUnitQuantity) || 0
      if (unit === 0 && sub === 0) {
        toast.error("Enter quantity for all items")
        return
      }

      const priceUnit = Number(item.sellingPricePerUnit) || 0
      const priceSub = Number(item.sellingPricePerSubUnit) || 0
      if (priceUnit === 0 && priceSub === 0) {
        toast.error("Enter selling price for all items")
        return
      }
    }

    if (typeof paidAmount !== 'number' || paidAmount < 0 || paidAmount > grandTotal) {
      toast.error("Paid amount must be between 0 and Grand Total")
      return
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/sales/`, {
        customerId,
        paidAmount,
        items: items.map(item => ({
          inventoryId: item.inventoryId,
          unitQuantity: Number(item.unitQuantity) || 0,
          subUnitQuantity: Number(item.subUnitQuantity) || 0,
          sellingPricePerUnit: Number(item.sellingPricePerUnit) || 0,
          sellingPricePerSubUnit: Number(item.sellingPricePerSubUnit) || 0,
        }))
      })

      toast.success("Sale created successfully")
      setOpen(false)
      onCreated?.()

      setCustomerId("")
      setPaidAmount("")
      setItems([{
        inventoryId: "",
        productName: "",
        sku: "",
        unitCapacity: 1,
        unitQuantity: "",
        subUnitQuantity: "",
        sellingPricePerUnit: "",
        sellingPricePerSubUnit: "",
      }])
      setActiveIndex(0)
    } catch (err: any) {
      console.log(err.response?.data)
      if (err?.response?.status !== 403) toast.error(err?.response?.data?.message || "Failed to create sale")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Sale</Button>
      </DialogTrigger>

      <DialogContent className="h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Sale</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          <div>
            <Label>Customer</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer (or walk-in)" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(c => (
                  <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {items.map((item, index) => {
            const isActive = index === activeIndex
            const unit = typeof item.unitQuantity === 'number' ? item.unitQuantity : 0
            const sub = typeof item.subUnitQuantity === 'number' ? item.subUnitQuantity : 0
            const priceUnit = typeof item.sellingPricePerUnit === 'number' ? item.sellingPricePerUnit : 0
            const priceSub = typeof item.sellingPricePerSubUnit === 'number' ? item.sellingPricePerSubUnit : 0
            const itemTotal = unit * priceUnit + sub * priceSub

            const skuDuplicate = item.sku
              ? items.some((other, i) => i !== index && other.sku === item.sku)
              : false

            return (
              <div key={index} className="border rounded">
                <div className={`flex justify-between items-center p-3 cursor-pointer ${isActive ? "bg-blue-50" : "bg-gray-50"}`} onClick={() => setActiveIndex(index)}>
                  <div>
                    <p className="font-semibold">{item.productName || `Item ${index + 1}`}</p>
                    {!isActive && <p className="text-xs text-gray-500">Qty: {unit} + {sub} | SKU: {item.sku || "-"}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm">Rs. {itemTotal}</span>
                    <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); removeItem(index) }}>Remove</Button>
                  </div>
                </div>

                {isActive && (
                  <div className="p-3 space-y-2">
                    <Select onValueChange={(v) => {
                      const selected = inventory.find(i => i._id === v)
                      updateItem(index, "inventoryId", v)
                      updateItem(index, "productName", selected?.productName)
                      updateItem(index, "sku", selected?.sku)
                      updateItem(index, "unitCapacity", selected?.unitCapacity)
                    }}>
                      <SelectTrigger ref={(el) => { selectRefs.current[index] = el }}>
                        <SelectValue placeholder="Select product (SKU visible)" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventory.map(i => <SelectItem key={i._id} value={i._id}>{i.productName} ({i.sku})</SelectItem>)}
                      </SelectContent>
                    </Select>

                    {skuDuplicate && <p className="text-red-500 text-sm">This SKU is already added in another item!</p>}

                    <div className="flex gap-2">
                      <Input type="number" placeholder="Units" value={item.unitQuantity} onChange={(e) => updateItem(index, "unitQuantity", e.target.value)} />
                      <Input type="number" placeholder="Sub-units" value={item.subUnitQuantity} onChange={(e) => updateItem(index, "subUnitQuantity", e.target.value)} />
                    </div>

                    <div className="flex gap-2">
                      <Input type="number" placeholder="Price per unit" value={item.sellingPricePerUnit} onChange={(e) => updateItem(index, "sellingPricePerUnit", e.target.value)} />
                      <Input type="number" placeholder="Price per sub-unit" value={item.sellingPricePerSubUnit} onChange={(e) => updateItem(index, "sellingPricePerSubUnit", e.target.value)} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="border-t pt-3 space-y-3">
          <Button variant="outline" onClick={addItem} className="w-full">+ Add Another Item</Button>

          <div className="flex flex-col space-y-1 font-semibold">
            <div>Grand Total: Rs. {grandTotal}</div>
            <div className="flex items-center gap-2">
              Paid Amount:
              <Input type="number" min={0} max={grandTotal} value={paidAmount} onChange={(e) => setPaidAmount(e.target.value === "" ? "" : Number(e.target.value))} className="w-32" />
            </div>
            <div>Due Amount: Rs. {dueAmount}</div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Sale</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}