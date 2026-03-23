import express from "express"
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCreditLimit, updateCustomer } from "../controllers/customer.js";

const customerRouter = express.Router();

customerRouter.post("/", createCustomer);
customerRouter.get("/", getCustomers);
customerRouter.get("/:id", getCustomerById);
customerRouter.put("/:id", updateCustomer);
customerRouter.delete("/:id", deleteCustomer);
customerRouter.patch("/:id/credit-limit", updateCreditLimit);

export default customerRouter;
