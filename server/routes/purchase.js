import express from "express"
import { createPurchase, getPurchaseById, getPurchases} from "../controllers/purchase.js";

import { allowRoles, protect } from "../middlewares/auth.js";
const purchaseRouter = express.Router();

purchaseRouter.use(protect);
purchaseRouter.use(allowRoles("OWNER", "ADMIN"));

purchaseRouter.post("/", createPurchase);
purchaseRouter.get("/", getPurchases);
purchaseRouter.get("/:id", getPurchaseById)
// purchaseRouter.post("/return", returnPurchase)

export default purchaseRouter;