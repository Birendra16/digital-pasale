import mongoose from "mongoose";

const PurchaseItemSchema = new mongoose.Schema({

    productName: {
        type: String,
        required: true,
        trim: true
    },

    //  Reference to Unit (Carton, Sack, etc.)
    buyingUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
        required: true
    },

    // Reference to Unit (Bottle, Kg, etc.)
    subUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
        required: true
    },

    // 1 Buying Unit = ? Subunits
    unitCapacity: {
        type: Number,
        required: true,
        min: 1
    },

    buyingQuantity: {
        type: Number,
        required: true,
        min: 0
    },

    totalSubUnits: Number,

    costPricePerUnit: {
        type: Number,
        required: true
    },

    costPricePerSubUnit: Number,

    totalCost: Number

}, { _id: false });

const PurchaseSchema = new mongoose.Schema({

    supplierName: {
        type: String,
        required: true
    },

    items: [PurchaseItemSchema],

    totalAmount: Number

}, { timestamps: true });

/**
 * Auto calculations
 */
PurchaseSchema.pre("save", function (next) {

    let grandTotal = 0;

    this.items.forEach(item => {

        item.totalSubUnits =
            item.buyingQuantity * item.unitCapacity;

        item.costPricePerSubUnit =
            item.costPricePerUnit / item.unitCapacity;

        item.totalCost =
            item.buyingQuantity * item.costPricePerUnit;

        grandTotal += item.totalCost;
    });

    this.totalAmount = grandTotal;

    next();
});

const Purchase = mongoose.model("Purchase", PurchaseSchema);
export default Purchase;