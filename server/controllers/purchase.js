import Purchase from "../models/purchase.js";
import Inventory from "../models/inventory.js";
import StockLog from "../models/stocklog.js";


// CREATE PURCHASE
export const createPurchase = async (req, res) => {
  try {
    const { supplier, items } = req.body;

    if (!supplier || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid purchase data" });
    }

    let totalAmount = 0;

    const purchase = await Purchase.create({ supplier, items });

    for (const item of items) {
      if (
        !item.product ||
        !item.unit ||
        item.quantity <= 0 ||
        item.costPrice <= 0
      ) {
        return res.status(400).json({ message: "Invalid item data" });
      }

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

    res.status(201).json({ message: "Purchase created", purchase });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET ALL PURCHASES
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("supplier")
      .populate("items.product")
      .populate("items.unit")
      .sort({ createdAt: -1 });

    res.json({ purchases });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE PURCHASE
export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplier")
      .populate("items.product")
      .populate("items.unit");

    if (!purchase) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ purchase });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// PURCHASE RETURN 
export const returnPurchase = async (req, res) => {
  try {
    const { purchaseId, items } = req.body;

    if (!purchaseId || !items?.length) {
      return res.status(400).json({ message: "Invalid return data" });
    }

    const purchase = await Purchase.findById(purchaseId);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // ✅ VALIDATION
    for (const item of items) {

      const inventory = await Inventory.findOne({
        product: item.product,
        unit: item.unit,
      });

      if (!inventory) {
        return res.status(400).json({ message: "Inventory not found" });
      }

      if (inventory.quantity < item.quantity) {
        return res.status(400).json({ message: "Not enough stock" });
      }

      const purchaseItem = purchase.items.find(
        (p) =>
          p.product.toString() === item.product.toString() &&
          p.unit.toString() === item.unit.toString()
      );

      if (!purchaseItem) {
        return res.status(400).json({ message: "Item not in purchase" });
      }

      if (item.quantity > purchaseItem.quantity) {
        return res.status(400).json({
          message: "Return exceeds purchased quantity",
        });
      }
    }

    // ✅ UPDATE
    for (const item of items) {
      const inventory = await Inventory.findOne({
        product: item.product,
        unit: item.unit,
      });

      inventory.quantity -= item.quantity;
      await inventory.save();

      await StockLog.create({
        inventory: inventory._id,
        quantityOut: item.quantity,
        movementType: "PURCHASE_RETURN",
        reason: "Returned to supplier",
      });
    }

    res.json({ message: "Return successful" });

  } catch (err) {
    console.error(err); // 👈 ADD THIS FOR DEBUG
    res.status(500).json({ message: err.message });
  }
};