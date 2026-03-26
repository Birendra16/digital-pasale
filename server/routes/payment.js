import express from "express";
import { verifyPayment } from "../controllers/paymentController.js";
import { protect } from "../middlewares/auth.js";

const paymentRouter = express.Router();

paymentRouter.post("/verify", protect, verifyPayment);

export default paymentRouter;