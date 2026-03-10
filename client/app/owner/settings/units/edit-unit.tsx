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
  symbol: string
  isFractional: boolean
}

interface Props {
  unit: Unit
  editUnit: (id: string, data: any) => Promise<void> // 🔴 CHANGED
}

export default function EditUnit({ unit, editUnit }: Props) {

const [name,setName] = useState(unit.name) // 🔴 CHANGED
const [symbol,setSymbol] = useState(unit.symbol)
const [isFractional,setIsFractional] = useState(unit.isFractional)

const handleSubmit = async () => {
  await editUnit(unit._id,{
    name,
    symbol,
    isFractional
  })
}

return(
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
<Label>Symbol</Label>
<Input value={symbol} onChange={(e)=>setSymbol(e.target.value)} />
</div>

<label className="flex gap-2">
<input
type="checkbox"
checked={isFractional}
onChange={(e)=>setIsFractional(e.target.checked)}
/>
Allow Fraction
</label>

</div>

<DialogFooter>
<Button onClick={handleSubmit}>Save</Button>
</DialogFooter>

</DialogContent>

</Dialog>
)
}