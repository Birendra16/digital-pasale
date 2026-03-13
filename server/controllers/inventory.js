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
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const { productId, unitId, quantityIn, quantityOut, damaged, reason, expiryDate,movementType } = req.body;

        let inventory = await Inventory.findOne({
            product: productId,
            unit: unitId
        }).session(session)

        // create inventory if not exists
        if (!inventory) {
            inventory = await Inventory.create([{
                product: productId,
                unit: unitId,
                quantity: 0,
                damaged: 0,
                expiryDate
            }], {session})
            inventory = inventory[0]
        }

        // update quantities
        if(quantityOut && inventory.quantity < quantityOut){
            throw new Error("Not enough stock available")
        }
        if (quantityIn){
             inventory.quantity += quantityIn
        }
        if (quantityOut){
             inventory.quantity -= quantityOut
        }

        if (damaged) {
            if (inventory.quantity < damaged) {
                throw new Error("Not enough stock for damaged record")
            }
            inventory.damaged += damaged;
            inventory.quantity -= damaged;
        }

        if (expiryDate) {
            inventory.expiryDate = expiryDate
        }

        await inventory.save({session});

        // create stock log
        const log = await StockLog.create([{
            inventory: inventory._id,
            quantityIn: quantityIn || 0,
            quantityOut: quantityOut || 0,
            damaged: damaged || 0,
            movementType,
            reason
        }], {session});

        // commit transaction
        await session.commitTransaction()
        session.endSession()

        //low stock alert
        const lowStockAlert =
        inventory.quantity <= inventory.lowStockThreshold

        res.status(200).json({
            message: "Stock updated successfully",
            inventory,
            log,
            lowStockAlert
        });

    } catch (err) {
        await session.abortTransaction()
        session.endSession()
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