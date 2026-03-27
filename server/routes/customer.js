import express from "express"
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCreditLimit, updateCustomer } from "../controllers/customer.js";

import { allowRoles, protect } from "../middlewares/auth.js";
const customerRouter = express.Router();

customerRouter.use(protect);
customerRouter.use(allowRoles("OWNER", "ADMIN"));

customerRouter.post("/", createCustomer);
customerRouter.get("/", getCustomers);
customerRouter.get("/:id", getCustomerById);
customerRouter.put("/:id", updateCustomer);
customerRouter.delete("/:id", deleteCustomer);
customerRouter.patch("/:id/credit-limit", updateCreditLimit);

export default customerRouter;
