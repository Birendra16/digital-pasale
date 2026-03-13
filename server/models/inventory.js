import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required: true
    },
    unit:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Unit",
        required:true
    },
    quantity:{
        type:Number,
        default:0,
        min:0
    },
    damaged: {
        type:Number,
        default:0,
    },
    expiryDate:{
        type:Date
    },
    lowStockThreshold:{
        type:Number,
        default:10,
    }
}, {timestamps:true});

const Inventory = mongoose.model("Inventory", InventorySchema);
export default Inventory;

        
    