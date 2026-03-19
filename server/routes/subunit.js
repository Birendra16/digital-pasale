import express from "express"
import { createSubUnit, deleteSubUnit, getSubUnits, updateSubUnit } from "../controllers/subunit.js";

const subUnitRouter = express.Router();

subUnitRouter.post("/",createSubUnit)
subUnitRouter.get("/", getSubUnits)
subUnitRouter.put("/:id",updateSubUnit)
subUnitRouter.delete("/:id", deleteSubUnit)

export default subUnitRouter;

