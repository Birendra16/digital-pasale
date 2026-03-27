import express from "express"
import { createSubUnit, deleteSubUnit, getSubUnits, updateSubUnit } from "../controllers/subunit.js";
import { allowRoles, protect } from "../middlewares/auth.js";

const subUnitRouter = express.Router();

subUnitRouter.use(protect);
subUnitRouter.use(allowRoles("OWNER", "ADMIN"));

subUnitRouter.post("/", createSubUnit)
subUnitRouter.get("/", getSubUnits)
subUnitRouter.put("/:id", updateSubUnit)
subUnitRouter.delete("/:id", deleteSubUnit)

export default subUnitRouter;

