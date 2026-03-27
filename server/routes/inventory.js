import express from 'express'
import { getInventory, getStockLogs, updateStock } from '../controllers/inventory.js'
import { allowRoles, protect } from '../middlewares/auth.js';
const inventoryRouter = express.Router()

inventoryRouter.use(protect);
inventoryRouter.use(allowRoles("OWNER", "ADMIN"));

// Get all inventory
inventoryRouter.get("/",getInventory)
// Update stock (in/out/damaged/expiry)
inventoryRouter.put("/update", updateStock)
// Get stock logs for a specific inventory record
inventoryRouter.get("/logs/:inventoryId", getStockLogs)

export default inventoryRouter
