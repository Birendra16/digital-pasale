import Sales from "../models/sales.js";
import Inventory from "../models/inventory.js";
import Customer from "../models/customer.js";
import { io } from "../index.js";

// CREATE SALES (SINGLE DOC WITH ITEMS[])
export const createBulkSales = async (req, res) => {
  try {
    const { customerId, items = [], paidAmount = 0 } = req.body;

    if (!items.length) {
      return res.status(400).json({ message: "No sale items provided" });
    }

    let grandTotal = 0;
    const formattedItems = [];

    // LOOP ITEMS
    for (let item of items) {
      let {
        inventoryId,
        unitQuantity = 0,
        subUnitQuantity = 0,
        sellingPricePerUnit = 0,
        sellingPricePerSubUnit = 0,
        note = "",
      } = item;

      // Convert to numbers
      unitQuantity = Number(unitQuantity) || 0;
      subUnitQuantity = Number(subUnitQuantity) || 0;
      sellingPricePerUnit = Number(sellingPricePerUnit) || 0;
      sellingPricePerSubUnit = Number(sellingPricePerSubUnit) || 0;

      // Fetch inventory
      const inventory = await Inventory.findById(inventoryId);
      if (!inventory) {
        return res.status(404).json({
          message: `Inventory not found: ${inventoryId}`,
        });
      }

      const unitCapacity = inventory.unitCapacity;
      const totalSubUnits =
        unitQuantity * unitCapacity + subUnitQuantity;

      if (totalSubUnits <= 0) {
        return res.status(400).json({
          message: "Quantity must be greater than 0",
        });
      }

      // Normalize quantities
      const finalUnitQty = Math.floor(totalSubUnits / unitCapacity);
      const finalSubUnitQty = totalSubUnits % unitCapacity;

      // Stock check
      if (inventory.totalSubUnits < totalSubUnits) {
        return res.status(400).json({
          message: `Not enough stock for SKU: ${inventory.sku}`,
        });
      }

      // Calculate total
      const totalAmount =
        finalUnitQty * sellingPricePerUnit +
        finalSubUnitQty * sellingPricePerSubUnit;

      grandTotal += totalAmount;

      // Deduct inventory
      inventory.totalSubUnits -= totalSubUnits;
      inventory.totalBuyingUnits = Math.floor(
        inventory.totalSubUnits / unitCapacity
      );

      await inventory.save();

      // Push into items array
      formattedItems.push({
        inventory: inventoryId,
        productName: inventory.productName,
        sku: inventory.sku,

        unitQuantity: finalUnitQty,
        subUnitQuantity: finalSubUnitQty,
        totalSubUnits,

        sellingPricePerUnit,
        sellingPricePerSubUnit,

        totalAmount,
        note,
      });

      // Real-time update
      io.emit("inventoryUpdated", {
        sku: inventory.sku,
        totalSubUnits: inventory.totalSubUnits,
        totalBuyingUnits: inventory.totalBuyingUnits,
      });
    }

    // PAYMENT LOGIC
    const finalPaid = Number(paidAmount) || 0;

    if (finalPaid > grandTotal) {
      return res.status(400).json({
        message: "Paid amount cannot exceed total amount",
      });
    }

    const dueAmount = grandTotal - finalPaid;

    let paymentStatus = "due";
    if (dueAmount === 0) paymentStatus = "paid";
    else if (finalPaid > 0) paymentStatus = "partial";

    // CREATE SINGLE SALE DOCUMENT
    const sale = await Sales.create({
      customer: customerId || null,
      items: formattedItems,
      totalAmount: grandTotal,
      paidAmount: finalPaid,
      dueAmount,
      paymentStatus,
    });

    // UPDATE CUSTOMER BALANCE
    if (customerId) {
      const customer = await Customer.findById(customerId);
      if (customer) {
        customer.balanceDue += dueAmount;
        await customer.save();
      }
    }

    res.status(201).json({
      message: "Sale recorded successfully",
      data: sale,
    });

  } catch (error) {
    console.error("CREATE SALES ERROR:", error);
    res.status(500).json({
      message: "Error creating sales",
      error: error.message,
    });
  }
};

// GET ALL SALES
export const getSales = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    let query = {};

    if (search) {
      // Find customers matching the search
      const matchingCustomers = await Customer.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { shopName: { $regex: search, $options: "i" } }
        ]
      }).select("_id");

      const customerIds = matchingCustomers.map(c => c._id);

      query = {
        $or: [
          { "items.productName": { $regex: search, $options: "i" } },
          { customer: { $in: customerIds } }
        ]
      };
    }

    const sales = await Sales.find(query)
      .populate("items.inventory") 
      .populate("customer", "name phone shopName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Sales.countDocuments(query);

    res.json({
      data: sales,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE SALE
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id)
      .populate("items.inventory") 
      .populate("customer");

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};