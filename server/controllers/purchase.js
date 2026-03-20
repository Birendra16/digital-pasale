import Purchase from "../models/purchase.js"
import Unit from "../models/unit.js"
import SubUnit from "../models/subunit.js"
import Supplier from "../models/supplier.js"

/**
 * Create Purchase
 */
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

    // Validate each item
    for (let item of items) {
      let { productName, buyingUnit, subUnit, unitCapacity, buyingQuantity, costPricePerUnit } = item

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

/**
 * Get All Purchases
 */
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .sort({ createdAt: -1 })
      .populate("supplierId items.buyingUnit items.subUnit")

    res.json({ purchases })
  } catch (error) {
    console.error("GET PURCHASES ERROR:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

/**
 * Get Purchase By ID
 */
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