import express from "express";
import { protect } from "../middlewares/auth.js";
import { ownerOnly } from "../middlewares/role.js";
import { getMySubscription } from "../controllers/subscription.js";

const subscriptionRouter = express.Router();

subscriptionRouter.get("/me", protect, ownerOnly, getMySubscription);

export default subscriptionRouter;
