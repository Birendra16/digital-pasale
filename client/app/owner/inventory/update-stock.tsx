import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const UpdateStockModal = ({ item, close, refresh }) => {

  const [form, setForm] = useState({
    quantityIn: 0,
    quantityOut: 0,
    damaged: 0,
    reason: "",
    movementType: "PURCHASE",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const qtyIn = Number(form.quantityIn) || 0;
    const qtyOut = Number(form.quantityOut) || 0;
    const damaged = Number(form.damaged) || 0;

    if (qtyIn < 0 || qtyOut < 0 || damaged < 0) {
      toast.error("Quantities cannot be negative");
      return;
    }

    if (!qtyIn && !qtyOut && !damaged) {
      toast.error("Enter at least one quantity to change");
      return;
    }

    await axios.put(`http://localhost:8080/api/inventory/update`, {
      productId: item.product._id,
      unitId: item.unit._id,
      quantityIn: qtyIn,
      quantityOut: qtyOut,
      damaged,
      reason: form.reason,
      movementType: form.movementType,
    });

    refresh();
    close();
  }; 

  return (
   <Dialog open={true} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Stock - {item.product?.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Quantity In</label>
            <Input
              name="quantityIn"
              type="number"
              placeholder="Enter quantity in"
              min={0}
              value={form.quantityIn ?? ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Quantity Out</label>
            <Input
              name="quantityOut"
              type="number"
              placeholder="Enter quantity out"
              min={0}
              value={form.quantityOut ?? ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Damaged</label>
            <Input
              name="damaged"
              type="number"
              placeholder="Enter damaged quantity"
              min={0}
              value={form.damaged ?? ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Reason</label>
            <Input
              name="reason"
              placeholder="Enter reason"
              value={form.reason ?? ""}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Movement Type</label>
            <Select
              value={form.movementType}
              onValueChange={(val) => setForm({ ...form, movementType: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select movement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PURCHASE">Purchase</SelectItem>
                <SelectItem value="SALE">Sale</SelectItem>
                <SelectItem value="DAMAGE">Damage</SelectItem>
                <SelectItem value="RETURN">Return</SelectItem>
                <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button onClick={close} variant="outline">Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateStockModal