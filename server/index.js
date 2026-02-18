import express from "express";
import dotenv from "dotenv";
import Connect from "./db/connect.js";
import authRouter from "./routes/user.js";
import subscriptionRouter from "./routes/subscription.js";

dotenv.config();

const app = express();
app.use(express.json());

Connect();

app.use("/api/auth", authRouter);
app.use("/api/subscription", subscriptionRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
