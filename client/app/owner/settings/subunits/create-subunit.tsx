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

interface CreateSubUnitProps {
  createSubUnit: (payload: { name: string; shortName: string }) => Promise<void>
}

export default function CreateSubUnit({ createSubUnit }: CreateSubUnitProps) {
  const [name, setName] = useState("")
  const [shortName, setShortName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const resetForm = () => {
    setName("")
    setShortName("")
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !shortName) {
      toast.error("Name and Short Name are required")
      return
    }

    try {
      setSubmitting(true)
      await createSubUnit({ name, shortName })
      resetForm()
      setOpen(false)
    } catch {
      
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
        <Button>Add SubUnit</Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add SubUnit</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new subunits.
              </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <Label>SubUnit Name</Label>
              <Input
                placeholder="Packet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Short Name</Label>
              <Input
                placeholder="pkt"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
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