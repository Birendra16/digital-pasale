import express from "express"
import { createPurchase, getPurchaseById, getPurchases, returnPurchase } from "../controllers/purchase.js";

const purchaseRouter = express.Router();

purchaseRouter.post("/", createPurchase);
purchaseRouter.get("/", getPurchases);
purchaseRouter.get("/:id", getPurchaseById)
purchaseRouter.post("/return", returnPurchase)

export default purchaseRouter;