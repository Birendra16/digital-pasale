import express from "express";
import dotenv from "dotenv";
import Connect from "./db/connect.js";
import authRouter from "./routes/user.js";
import subscriptionRouter from "./routes/subscription.js";
import cors from "cors";
import productRouter from "./routes/product.js";

import "./models/unit.js";
import "./models/product.js";
import unitRouter from "./routes/unit.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

Connect();

app.use("/api/auth", authRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/products", productRouter);
app.use("/api/units", unitRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
