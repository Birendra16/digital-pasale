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

interface Unit {
  _id: string
  name: string
  shortName: string
}

interface Props {
  unit: Unit
  editUnit: (id: string, data: any) => Promise<void>
}

export default function EditUnit({ unit, editUnit }: Props) {

  const [name, setName] = useState(unit.name)
  const [shortName, setShortName] = useState(unit.shortName)

  const handleSubmit = async () => {
    await editUnit(unit._id, {
      name,
      shortName
    })
  }

  return (
    <Dialog>

      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Edit Unit</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">

          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e)=>setName(e.target.value)} />
          </div>

          <div>
            <Label>Short Name</Label>
            <Input value={shortName} onChange={(e)=>setShortName(e.target.value)} />
          </div>

        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}