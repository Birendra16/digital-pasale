"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Props {
  id: string
  deleteUnit: (id: string) => Promise<void>
}

export default function DeleteUnit({ id, deleteUnit }: Props) {

  const handleDelete = async () => {
    try {
      await deleteUnit(id)
    } catch {
    }
  }

  return (
    <Dialog>

      {/* Trigger button inside dropdown */}
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-red-500 w-full justify-start">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Delete Unit</DialogTitle>
          <DialogDescription>
            This action will permanently delete the unit.        
            </DialogDescription>
        </DialogHeader>

        <div>
          Are you sure you want to delete this unit?
        </div>

        <DialogFooter>

          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogClose>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  )
}