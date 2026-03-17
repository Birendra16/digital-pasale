import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import SupplierForm from "./supplier-form";

const CreateSupplier = ({ fetchSuppliers }: any) => {
  const [open, setOpen] = useState(false);

  const initialValues = {
    name: "",
    phone: "",
    email: "",
    address: "",
    taxNumber: "",
  };

  const createSupplier = async (supplierInfo) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8080/api/suppliers",
      supplierInfo
    );
    return data;
  } catch (err) {
    throw err; 
  }
};

  const handleSubmit = async (values: any, { resetForm, setSubmitting }: any) => {
  try {
    const data = await createSupplier(values);

    toast.success(data.message || "Supplier created successfully");

    await fetchSuppliers();
    resetForm();
    setOpen(false);
  } catch (err: any) {
    toast.error(
      err.response?.data?.message || "Failed to create supplier"
    );
  } finally {
    setSubmitting(false); 
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Supplier</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Supplier</DialogTitle>
        </DialogHeader>

        <SupplierForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateSupplier;