import express from 'express'
import { getInventory, getStockLogs, updateStock } from '../controllers/inventory.js'
const inventoryRouter = express.Router()

// Get all inventory
inventoryRouter.get("/",getInventory)
// Update stock (in/out/damaged/expiry)
inventoryRouter.put("/update", updateStock)
// Get stock logs for a specific inventory record
inventoryRouter.get("/logs/:inventoryId", getStockLogs)

export default inventoryRouter
