import Inventory from "../models/inventory.js";
import StockLog from "../models/stocklog.js";

// Get all inventory
const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find()
            .populate("product")
            .populate("unit")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Inventory retrieved successfully",
            inventory
        });
    } catch (err) {
        res.status(500).json({
            message: "Error retrieving inventory",
            error: err.message
        });
    }
};

// Update stock
const updateStock = async (req, res) => {
    try {
        const { productId, unitId, quantityIn, quantityOut, damaged, reason, expiryDate } = req.body;

        let inventory = await Inventory.findOne({
            product: productId,
            unit: unitId
        });

        // create inventory if not exists
        if (!inventory) {
            inventory = await Inventory.create({
                product: productId,
                unit: unitId,
                quantity: 0,
                damaged: 0,
                expiryDate
            });
        }

        // update quantities
        if (quantityIn) inventory.quantity += quantityIn;
        if (quantityOut) inventory.quantity -= quantityOut;

        if (damaged) {
            inventory.damaged += damaged;
            inventory.quantity -= damaged;
        }

        if (expiryDate) inventory.expiryDate = expiryDate;

        await inventory.save();

        // create stock log
        const log = await StockLog.create({
            inventory: inventory._id,
            quantityIn: quantityIn || 0,
            quantityOut: quantityOut || 0,
            damaged: damaged || 0,
            reason
        });

        res.status(200).json({
            message: "Stock updated successfully",
            inventory,
            log
        });

    } catch (err) {
        res.status(500).json({
            message: "Error updating stock",
            error: err.message
        });
    }
};

// Get stock logs
const getStockLogs = async (req, res) => {
    try {
        const logs = await StockLog.find({
            inventory: req.params.inventoryId
        })
        .populate({
            path: "inventory",
            populate: [
                { path: "product" },
                { path: "unit" }
            ]
        })
        .sort({ date: -1 });

        res.status(200).json({
            message: "Stock logs retrieved successfully",
            logs
        });

    } catch (err) {
        res.status(500).json({
            message: "Error retrieving stock logs",
            error: err.message
        });
    }
};

export { getInventory, updateStock, getStockLogs };