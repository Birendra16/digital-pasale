"use client"

import { useState } from "react"
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
import { toast } from "sonner"

interface SubUnit {
  _id: string
  name: string
  shortName: string
}

interface EditSubUnitProps {
  subUnit: SubUnit
  editSubUnit: (id: string, data: { name: string; shortName: string }) => Promise<void>
}

export default function EditSubUnit({ subUnit, editSubUnit }: EditSubUnitProps) {
  const [name, setName] = useState(subUnit.name)
  const [shortName, setShortName] = useState(subUnit.shortName)
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = async () => {
    if (!name || !shortName) {
      toast.error("Name and Short Name are required")
      return
    }

    try {
      setSubmitting(true)
      await editSubUnit(subUnit._id, { name, shortName })
      setOpen(false)
    } catch {
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit SubUnit</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <Label>SubUnit Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Short Name</Label>
            <Input value={shortName} onChange={(e) => setShortName(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
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