import express from 'express';
import { createUnit, getUnits, getUnit, updateUnit, deleteUnit } from '../controllers/unit.js';

const unitRouter = express.Router();

unitRouter.post("/", createUnit);
unitRouter.get("/", getUnits);
unitRouter.get("/:id", getUnit);
unitRouter.put("/:id", updateUnit);
unitRouter.delete("/:id", deleteUnit);

export default unitRouter;