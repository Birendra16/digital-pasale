import Purchase from "../models/purchase.js"
import Unit from "../models/unit.js"
import SubUnit from "../models/subunit.js"
import Supplier from "../models/supplier.js"
import Inventory from "../models/inventory.js"
import { io } from "../index.js"


 // Create Purchase
export const createPurchase = async (req, res) => {
  try {
    const { supplierId, items } = req.body

    // Basic validation
    if (!supplierId || !items || items.length === 0) {
      return res.status(400).json({ message: "Supplier and items are required" })
    }

    // Check if supplier exists
    const supplierExists = await Supplier.findById(supplierId)
    if (!supplierExists) {
      return res.status(400).json({ message: "Invalid supplier reference" })
    }

    // Duplicate Check : Track SKUs
    const skuSet = new Set()

    for (let item of items) {
      let { productName, sku, buyingUnit, subUnit, unitCapacity, buyingQuantity, costPricePerUnit } = item
      sku = sku?.trim().toUpperCase()

      if(!sku){
        return res.status(400).json({message: "SKU is required for each item"})
      }
      
      // Duplicate check
      if(skuSet.has(sku)){
        return res.status(400).json({message:`Duplicate SKU found: ${sku}`})
      }
      skuSet.add(sku)
      item.sku = sku

      // Convert to numbers
      unitCapacity = Number(unitCapacity)
      buyingQuantity = Number(buyingQuantity)
      costPricePerUnit = Number(costPricePerUnit)

      // Required checks
      if (!productName || !buyingUnit || !subUnit || unitCapacity <= 0 || buyingQuantity < 0 || costPricePerUnit <= 0) {
        return res.status(400).json({ message: "All item fields are required and must be valid" })
      }

      // Check Units exist
      const buyingUnitExists = await Unit.findById(buyingUnit)
      const subUnitExists = await SubUnit.findById(subUnit)
      if (!buyingUnitExists || !subUnitExists) {
        return res.status(400).json({ message: "Invalid unit reference" })
      }

      // Prevent same unit
      if (buyingUnit.toString() === subUnit.toString()) {
        return res.status(400).json({ message: "Buying unit and subunit cannot be the same" })
      }

      // Assign cleaned values back
      item.unitCapacity = unitCapacity
      item.buyingQuantity = buyingQuantity
      item.costPricePerUnit = costPricePerUnit
    }

    // Create Purchase
    const purchase = new Purchase({
      supplierId,
      items,
    })

    await purchase.save()

    //Update Inventory Automatically
    for(const item of items){
      const { productName, sku, buyingUnit, subUnit, unitCapacity, buyingQuantity, costPricePerUnit } = item
      let inventory = await Inventory.findOne({sku: sku})
      const addedSubUnits = buyingQuantity * unitCapacity

      if(inventory){
        //update existing product
        inventory.totalSubUnits += addedSubUnits;
        inventory.totalBuyingUnits += buyingQuantity;
        inventory.lastCostPrice = costPricePerUnit;
        await inventory.save();
      } else {
        // create new inventory product
        inventory = new Inventory({
          productName,
          sku,
          buyingUnit,
          subUnit,
          unitCapacity,
          totalSubUnits: addedSubUnits,
          totalBuyingUnits: buyingQuantity,
          lastCostPrice: costPricePerUnit,
        })
        await inventory.save()
      }
    }

    // Emit WebSocket events for frontend real-time update
    io.emit("inventoryUpdated")

    // Populate for response
    await purchase.populate("supplierId items.buyingUnit items.subUnit")

    res.status(201).json({
      message: "Purchase created successfully",
      purchase,
    })
  } catch (error) {
    console.error("CREATE PURCHASE ERROR:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}


 // Get All Purchases

export const getPurchases = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "", date = "" } = req.query;

    let query = {};

    // 1. Search by supplier name or phone
    if (search) {
      const matchingSuppliers = await Supplier.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } }
        ]
      }).select("_id");

      const supplierIds = matchingSuppliers.map(s => s._id);

      query = {
        $or: [
          { supplierId: { $in: supplierIds } },
          { "items.productName": { $regex: search, $options: "i" } },
          { "items.sku": { $regex: search, $options: "i" } }
        ]
      };
    }

    // 2. Search by Date (if provided)
    if (date) {
      // date is expected in YYYY-MM-DD
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const purchases = await Purchase.find(query)
      .sort({ createdAt: -1 })
      .populate("supplierId items.buyingUnit items.subUnit")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Purchase.countDocuments(query);

    res.json({ 
      purchases,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("GET PURCHASES ERROR:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}


 // Get Purchase By ID
 
export const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params
    const purchase = await Purchase.findById(id).populate("supplierId items.buyingUnit items.subUnit")
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" })
    }
    res.json({ purchase })
  } catch (error) {
    console.error("GET PURCHASE BY ID ERROR:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}