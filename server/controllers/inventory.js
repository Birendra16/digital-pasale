import mongoose from "mongoose";
import Inventory from "../models/inventory.js";
import StockLog from "../models/stocklog.js";

// Get all inventory
const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find()
            .populate("buyingUnit")
            .populate("subUnit")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Inventory retrieved successfully",
            products: inventory
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      productId,
      unitId,
      quantityIn,
      quantityOut,
      damaged,
      reason,
      expiryDate,
      movementType,
    } = req.body;

    const qtyIn = Number(quantityIn) || 0;
    const qtyOut = Number(quantityOut) || 0;
    const damagedQty = Number(damaged) || 0;

    if (qtyIn < 0 || qtyOut < 0 || damagedQty < 0) {
      return res.status(400).json({
        message: "Quantities cannot be negative",
      });
    }

    let inventory = await Inventory.findOne({
      product: productId,
      unit: unitId,
    }).session(session);

    // create inventory if not exists
    if (!inventory) {
      inventory = await Inventory.create(
        [
          {
            product: productId,
            unit: unitId,
            quantity: 0,
            damaged: 0,
            expiryDate,
          },
        ],
        { session }
      );
      inventory = inventory[0];
    }

    // update quantities
    if (qtyOut && inventory.quantity < qtyOut) {
      throw new Error("Not enough stock available");
    }
    if (qtyIn) {
      inventory.quantity += qtyIn;
    }
    if (qtyOut) {
      inventory.quantity -= qtyOut;
    }

    if (damagedQty) {
      if (inventory.quantity < damagedQty) {
        throw new Error("Not enough stock for damaged record");
      }
      inventory.damaged += damagedQty;
      inventory.quantity -= damagedQty;
    }

    if (expiryDate) {
      inventory.expiryDate = expiryDate;
    }

    await inventory.save({ session });

    // create stock log
    const log = await StockLog.create(
      [
        {
          inventory: inventory._id,
          quantityIn: qtyIn,
          quantityOut: qtyOut,
          damaged: damagedQty,
          movementType,
          reason,
        },
      ],
      { session }
    );

    // commit transaction
    await session.commitTransaction();
    session.endSession();

    // low stock alert
    const lowStockAlert =
      inventory.quantity <= inventory.lowStockThreshold;

    res.status(200).json({
      message: "Stock updated successfully",
      inventory,
      log,
      lowStockAlert,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      message: "Error updating stock",
      error: err.message,
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