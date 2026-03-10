"use client"

import { useState } from "react"
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

interface CreateUnitPayload {
  name: string
  symbol: string
  isFractional: boolean
}

interface CreateUnitProps {
  createUnit: (payload: CreateUnitPayload) => Promise<void>
}

export default function CreateUnit({ createUnit }: CreateUnitProps) {
  const [name, setName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [isFractional, setIsFractional] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const resetForm = () => {
    setName("")
    setSymbol("")
    setIsFractional(false)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !symbol) {
      toast.error("Name and symbol are required")
      return
    }

    try {
      setSubmitting(true)

      await createUnit({
        name,
        symbol,
        isFractional,
      })

      resetForm()
      setOpen(false)
    } catch {
      // error handled in parent
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog 
      open= {open}
      onOpenChange={(value)=>{
        setOpen(value)
        if(!value) resetForm()
      }}>
      <DialogTrigger asChild>
        <Button onClick={()=>setOpen(true)}>Add Unit</Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add Unit</DialogTitle>
            <DialogDescription>
              Create a new measurement unit
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <Label>Unit Name</Label>
              <Input
                placeholder="Kilogram"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Symbol</Label>
              <Input
                placeholder="kg"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isFractional}
                onChange={(e) => setIsFractional(e.target.checked)}
              />
              <Label>Allow Fractional Quantity</Label>
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