import express from "express"
import { createPurchase, getPurchases } from "../controllers/purchase.js";

const purchaseRouter = express.Router();

purchaseRouter.post("/", createPurchase);
purchaseRouter.get("/", getPurchases);

export default purchaseRouter;