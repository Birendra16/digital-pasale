import express from "express";
import { createStaff, deleteStaff, getStaff, updateStaff } from "../controllers/staff.js";
import { allowRoles, protect } from "../middlewares/auth.js";

const staffRouter = express.Router();

staffRouter.use(protect);
staffRouter.use(allowRoles("OWNER"));

staffRouter.post("/", createStaff);
staffRouter.get("/", getStaff);
staffRouter.put("/:id", updateStaff);
staffRouter.delete("/:id", deleteStaff);

export default staffRouter;
