import Purchase from "../models/purchase.js";
import Inventory from "../models/inventory.js";
import StockLog from "../models/stocklog.js";

const createPurchase = async (req, res) => {
  try {
    const { supplier, items } = req.body;

    if (!supplier || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid purchase data" });
    }

    for (const item of items) {
      if (
        !item.product ||
        !item.unit ||
        typeof item.quantity !== "number" ||
        typeof item.costPrice !== "number" ||
        item.quantity <= 0 ||
        item.costPrice <= 0
      ) {
        return res
          .status(400)
          .json({ message: "Quantity and cost price must be positive numbers" });
      }
    }

    let totalAmount = 0;

    // Create the purchase document first
    const purchase = await Purchase.create({
      supplier,
      items,
    });

    // Update inventory and stock logs for each item
    for (const item of items) {
      totalAmount += item.quantity * item.costPrice;

      let inventory = await Inventory.findOne({
        product: item.product,
        unit: item.unit,
      });

      if (!inventory) {
        inventory = await Inventory.create({
          product: item.product,
          unit: item.unit,
          quantity: item.quantity,
        });
      } else {
        inventory.quantity += item.quantity;
        await inventory.save();
      }

      await StockLog.create({
        inventory: inventory._id,
        quantityIn: item.quantity,
        movementType: "PURCHASE",
        reason: "Stock Purchased",
      });
    }

    purchase.totalAmount = totalAmount;
    await purchase.save();

    res.status(201).json({
      message: "Purchase recorded",
      purchase,
    });
  } catch (err) {
    res.status(500).json({
      message: "Purchase failed",
      error: err.message,
    });
  }
};

const getPurchases = async (req, res)=>{
    try{
        const purchases = await Purchase.find()
        .populate("items.product")
        .populate("items.unit")
        .sort({createdAt: -1});

        res.status(200).json({
            message: "Purchase retrieved",
            purchases
        })
    }catch(err){
        res.status(500).json({
            message:"Server error",
            error: err.message
        });
    }
};

export {createPurchase, getPurchases};