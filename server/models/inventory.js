import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true,
        trim: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
   buyingUnit:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
    required: true,
   },
   subUnit:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"SubUnit",
    required: true,
   },
   unitCapacity:{
    type: Number,
    required: true,
   },
   totalSubUnits:{
    type: Number,
    default: 0,
   },
   totalBuyingUnits:{
    type: Number,
    default: 0,
   },
   lastCostPrice: {
    type: Number,
    default: 0,
   },
}, {timestamps:true});

const Inventory = mongoose.model("Inventory", InventorySchema);
export default Inventory;

        
    