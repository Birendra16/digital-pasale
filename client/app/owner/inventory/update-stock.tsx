import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useState } from "react"

const UpdateStockModal = ({ item, close, refresh }) => {

const [form, setForm] = useState({
    quantityIn: 0,
    quantityOut:0,
    damaged:0,
    reason:"",
    movementType:"PURCHASE",
});

const handleChange = (e) =>{
    setForm({...form, [e.target.name]: e.target.value});
};

const handleSubmit = async ()=>{
  
  await axios.put(`http://localhost:8080/api/inventory/update`,{
    productId: item.product._id,
    unitId: item.unit._id,
    ...form
  })

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
          <Input name="quantityIn" type="number" placeholder="Quantity In" onChange={handleChange} />
          <Input name="quantityOut" type="number" placeholder="Quantity Out" onChange={handleChange} />
          <Input name="damaged" type="number" placeholder="Damaged" onChange={handleChange} />
          <Input name="reason" placeholder="Reason" onChange={handleChange} />

          <Select onValueChange={(val) => setForm({ ...form, movementType: val })}>
            <SelectTrigger>
              <SelectValue placeholder="Movement Type" />
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

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button onClick={close} variant="outline">Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateStockModal