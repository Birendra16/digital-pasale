import express from "express";
import {
  getSales,
  getSaleById,
  createBulkSales,
} from "../controllers/sales.js";

import { allowRoles, protect } from "../middlewares/auth.js";
const salesRouter = express.Router();

salesRouter.use(protect);
salesRouter.use(allowRoles("OWNER", "ADMIN"));

salesRouter.post("/", createBulkSales);
salesRouter.get("/", getSales);
salesRouter.get("/:id", getSaleById);

export default salesRouter;