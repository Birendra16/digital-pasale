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

interface DeleteSubUnitProps {
  id: string
  deleteSubUnit: (id: string) => Promise<void>
}

export default function DeleteSubUnit({ id, deleteSubUnit }: DeleteSubUnitProps) {
  const handleDelete = async () => {
    try {
      await deleteSubUnit(id)
    } catch {
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-red-500">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete SubUnit</DialogTitle>
          <DialogDescription>
            This action will permanently delete the subunit.        
            </DialogDescription>
        </DialogHeader>

        <div>Are you sure you want to delete this subunit?</div>

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