import mongoose from "mongoose";

const StockLogSchema = new mongoose.Schema({
    inventory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Inventory",
        required:true
    },
    quantityIn:{
        type:Number,
        default:0,
    },
    quantityOut:{
        type:Number,
        default:0,
    },
    damaged:{
        type:Number,
        default:0,
    },
    movementType:{
        type:String,
        enum:["PURCHASE","SALE","DAMAGE","ADJUSTMENT","RETURN","PURCHASE_RETURN"],
        required:true
    },
    reason:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    }
});

const StockLog = mongoose.model("StockLog", StockLogSchema);
export default StockLog;
