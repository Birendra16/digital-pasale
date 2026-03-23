"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Props {
  id: string
  deleteCustomer: (id: string) => Promise<void>
}

export default function DeleteCustomer({ id, deleteCustomer }: Props) {
  const handleDelete = async () => {
    try {
      await deleteCustomer(id)
      toast.success("Customer deleted successfully")
    } catch {
      toast.error("Failed to delete customer")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-red-500 w-full justify-start">Delete</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogDescription>
            This action will permanently delete the customer.        
            </DialogDescription>
        </DialogHeader>

        <div>Are you sure you want to delete this customer?</div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}