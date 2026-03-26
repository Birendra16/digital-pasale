import express from "express";
import dotenv from "dotenv";
import Connect from "./db/connect.js";
import authRouter from "./routes/auth.js";
import subscriptionRouter from "./routes/subscription.js";
import cors from "cors";

import "./models/unit.js";
import unitRouter from "./routes/unit.js";
import inventoryRouter from "./routes/inventory.js";
import purchaseRouter from "./routes/purchase.js";
import supplierRouter from "./routes/supplier.js";
import subUnitRouter from "./routes/subunit.js";
import { Server } from "socket.io";
import http from "http";
import customerRouter from "./routes/customer.js";
import salesRouter from "./routes/sales.js";
import dashboardRouter from "./routes/dashboard.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/admin.js";
import paymentRouter from "./routes/payment.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin:"http://localhost:3000",
    credentials: true,
  }
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

Connect();

app.use("/api/auth", authRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/units", unitRouter);
app.use("/api/subunits",subUnitRouter)
app.use("/api/inventory", inventoryRouter);
app.use("/api/purchases", purchaseRouter)
app.use("/api/suppliers", supplierRouter)
app.use("/api/customers", customerRouter)
app.use("/api/sales", salesRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payment", paymentRouter);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
