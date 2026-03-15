import Supplier from "../models/supplier.js"

const createSupplier = async(req, res)=>{
    try{
        const supplier = await Supplier.create(req.body);
        res.status(201).json({message:"Supplier Created", supplier});

    }
    catch(err)
    {
        res.status(500).json({message:"Server error", error:err.message})
    }
}

const getSuppliers = async (req, res)=>{
    try{
        const suppliers = await Supplier.find({}).sort({name:1});
        res.status(200).json({message:"Suppliers Retrieved", suppliers});
    }
    catch(err){
        res.status(500).json({message:"Server Error", error:err.message})

    }
}

const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.status(200).json({ message: "Supplier retrieved", supplier });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Supplier updated", supplier });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Supplier deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export {createSupplier, getSuppliers, getSupplier, updateSupplier, deleteSupplier};
