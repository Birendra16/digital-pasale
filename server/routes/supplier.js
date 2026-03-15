import express from 'express';
import { createSupplier, deleteSupplier, getSupplier, getSuppliers, updateSupplier } from '../controllers/supplier.js';

const supplierRouter = express.Router();

supplierRouter.post("/", createSupplier);
supplierRouter.get("/", getSuppliers);
supplierRouter.get("/:id", getSupplier);
supplierRouter.put("/:id", updateSupplier);
supplierRouter.delete("/:id", deleteSupplier);

export default supplierRouter;