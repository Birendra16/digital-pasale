import express from 'express';
import { createSupplier, deleteSupplier, getSupplier, getSuppliers, updateSupplier } from '../controllers/supplier.js';

import { allowRoles, protect } from '../middlewares/auth.js';
const supplierRouter = express.Router();

supplierRouter.use(protect);
supplierRouter.use(allowRoles("OWNER", "ADMIN"));

supplierRouter.post("/", createSupplier);
supplierRouter.get("/", getSuppliers);
supplierRouter.get("/:id", getSupplier);
supplierRouter.put("/:id", updateSupplier);
supplierRouter.delete("/:id", deleteSupplier);

export default supplierRouter;