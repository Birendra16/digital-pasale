import Purchase from "../models/purchase.js";
import Unit from "../models/unit.js";

/**
 * Create Purchase
 */
export const createPurchase = async (req, res) => {
    try {
        const { supplierName, items } = req.body;

        // Basic validation
        if (!supplierName || !items || items.length === 0) {
            return res.status(400).json({
                message: "Supplier and items are required"
            });
        }

        // Validate each item
        for (let item of items) {

            const {
                productName,
                buyingUnit,
                subUnit,
                unitCapacity,
                buyingQuantity,
                costPricePerUnit
            } = item;

            // Required checks
            if (
                !productName ||
                !buyingUnit ||
                !subUnit ||
                !unitCapacity ||
                !buyingQuantity ||
                !costPricePerUnit
            ) {
                return res.status(400).json({
                    message: "All item fields are required"
                });
            }

            // Check Units exist
            const buyingUnitExists = await Unit.findById(buyingUnit);
            const subUnitExists = await Unit.findById(subUnit);

            if (!buyingUnitExists || !subUnitExists) {
                return res.status(400).json({
                    message: "Invalid unit reference"
                });
            }

            // Prevent same unit
            if (buyingUnit.toString() === subUnit.toString()) {
                return res.status(400).json({
                    message: "Buying unit and subunit cannot be same"
                });
            }

            //  Logical validations
            if (unitCapacity <= 0 || buyingQuantity < 0) {
                return res.status(400).json({
                    message: "Invalid quantity or unit capacity"
                });
            }
        }

        // Create purchase (pre-save will calculate totals)
        const purchase = new Purchase({
            supplierName,
            items
        });

        await purchase.save();

        //  Populate units for response
        await purchase.populate("items.buyingUnit items.subUnit");

        res.status(201).json({
            message: "Purchase created successfully",
            purchase
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const getPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find()
            .sort({ createdAt: -1 })
            .populate("items.buyingUnit items.subUnit");

        res.json({ purchases });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
}; 

export const getPurchaseById = async (req, res) => {
    try {
        const { id } = req.params;

        const purchase = await Purchase.findById(id)
            .populate("items.buyingUnit items.subUnit");

        if (!purchase) {
            return res.status(404).json({
                message: "Purchase not found"
            });
        }

        res.json({ purchase });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};