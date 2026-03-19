"use client"

import { useState } from "react"
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
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"

interface CreateUnitPayload {
  name: string
  shortName: string
  type: "bigger" | "smaller" | "base"
  description?: string
}

interface CreateUnitProps {
  createUnit: (payload: CreateUnitPayload) => Promise<void>
}

export default function CreateUnit({ createUnit }: CreateUnitProps) {
  const [name, setName] = useState("")
  const [shortName, setShortName] = useState("")
  const [type, setType] = useState<"bigger" | "smaller" | "base">("base")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const resetForm = () => {
    setName("")
    setShortName("")
    setType("base")
    setDescription("")
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !shortName || !type) {
      toast.error("Name, symbol, and type are required")
      return
    }

    try {
      setSubmitting(true)

      await createUnit({
        name,
        shortName,
        type,
        description: description || undefined,
      })

      toast.success("Unit created successfully")
      resetForm()
      setOpen(false)
    } catch (err) {
      console.error(err)
      toast.error("Failed to create unit")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (!value) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button>Add Unit</Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add Unit</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">

            {/* Name */}
            <div className="flex flex-col gap-1">
              <Label>Unit Name</Label>
              <Input
                placeholder="Kilogram"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Short Name / Symbol */}
            <div className="flex flex-col gap-1">
              <Label>Symbol</Label>
              <Input
                placeholder="kg"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                required
              />
            </div>

            {/* Type */}
            {/* <div>
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "bigger" | "smaller" | "base")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="bigger">Bigger Unit</SelectItem>
                  <SelectItem value="smaller">Smaller Unit</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            {/* Optional Description */}
            {/* <div className="flex flex-col gap-1">
              <Label>Description (Optional)</Label>
              <Input
                placeholder="E.g., used for liquids"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div> */}
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