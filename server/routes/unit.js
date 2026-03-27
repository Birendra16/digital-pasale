import express from 'express';
import { createUnit, getUnits, updateUnit, deleteUnit } from '../controllers/unit.js';
import { allowRoles, protect } from '../middlewares/auth.js';

const unitRouter = express.Router();

unitRouter.use(protect)
unitRouter.use(allowRoles("OWNER", "ADMIN"));
unitRouter.post("/", createUnit);
unitRouter.get("/", getUnits);
// unitRouter.get("/:id", getUnit);
unitRouter.put("/:id", updateUnit);
unitRouter.delete("/:id", deleteUnit);

export default unitRouter;