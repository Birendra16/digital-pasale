import mongoose from "mongoose";

const PurchaseItemSchema = new mongoose.Schema({
    product: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    unit : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Unit",
        required: true
    },
    quantity:{
        type:Number,
        required:true,
    },
    costPrice: {
        type:Number,
        required: true
    }
});

const PurchaseSchema = new mongoose.Schema({
    supplier: {
        type: String,
        required: true
    },
    items: [PurchaseItemSchema],
    totalAmount: Number,
},
{timestamps: true}
);

const Purchase = mongoose.model("Purchase", PurchaseSchema)
export default Purchase;