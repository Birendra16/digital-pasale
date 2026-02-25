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
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Unit {
  _id: string
  name: string
  symbol: string
}

interface CreateProductsProps {
  createProduct: (payload: any) => Promise<void>
}

export default function CreateProducts({ createProduct }: CreateProductsProps) {
  const [units, setUnits] = useState<Unit[]>([])
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [baseUnit, setBaseUnit] = useState("")
  const [sellingPrice, setSellingPrice] = useState<string>("")
  const [costPrice, setCostPrice] = useState<string>("")
  const [showUnitForm, setShowUnitForm] = useState(false)
  const [unitName, setUnitName] = useState("")
  const [unitSymbol, setUnitSymbol] = useState("")

  // Fetch units on mount
  useEffect(() => {
    axios.get("http://localhost:8080/api/units")
      .then(res => setUnits(res.data.units))
      .catch(err => console.error(err))
  }, [])

  // Create a new unit
  const createUnit = async () => {
    if (!unitName || !unitSymbol) {
      toast("Unit name and symbol are required")
      return
    }

    try {
      const { data } = await axios.post("http://localhost:8080/api/units", {
        name: unitName,
        symbol: unitSymbol
      })

      // Add unit to dropdown
      setUnits(prev => [...prev, data.unit])

      // Auto select as base unit
      setBaseUnit(data.unit._id)

      // Reset + hide form
      setUnitName("")
      setUnitSymbol("")
      setShowUnitForm(false)
    } catch (error) {
      console.error(error)
      toast("Failed to create unit")
    }
  }

  // Submit new product
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!baseUnit) {
      toast("Please select a base unit")
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
          sellingPrice: Number(sellingPrice) || 0,
          costPrice: Number(costPrice) || 0,
        }
      ]
    }

    try {
      await createProduct(payload)

      // Reset form
      setName("")
      setSku("")
      setBaseUnit("")
      setSellingPrice("")
      setCostPrice("")
    } catch (error) {
      console.error(error)
      toast("Failed to create product")
    }
  }

  return (
    <Dialog>
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
                  required
                >
                  <option value="">Select Unit</option>
                  {units.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUnitForm(!showUnitForm)}
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
                min = {0}
                value={sellingPrice}
                onChange={e => 
                {
                    const val= e.target.value;
                    if(val === "" || Number(val) >=0) 
                    setSellingPrice(val)
                }
            }     
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Cost Price</Label>
              <Input
                type="number"
                min= {0}
                value={costPrice}
                onChange={e =>{
                    const val= e.target.value;
                    if(val === "" || Number(val) >=0)
                    setCostPrice(val)
                }
            }    
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}