import mongoose from "mongoose";

const ProductUnitSchema = new mongoose.Schema({
    unit:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Unit",
        required:true
    },
    conversionToBase:{
        type:Number,
        required:true,
        min:0.0001
    },
    sellingPrice:{
        type:Number,
        required:true,
    },
    costPrice:{
        type:Number,
        required:true,
    }
}, {_id:false}
);

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    sku:{
        type:String,
        required:true,
        unique:true
    },
    baseUnit:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Unit",
        required:true
    },
    units:{
        type:[ProductUnitSchema],
        required:true,
    },
    vatPercent:{
        type:Number,
        default:13
    },
    isActive:{
        type:Boolean,
        default:true
    }
}, {timestamps:true}
);

// Ensure base unit exists with conversion =1
ProductSchema.pre("save", function(next){
    const baseExists = this.units.some(
        u =>
            u.unit.toString()===this.baseUnit.toString() &&
            u.conversionToBase===1
    );
    if(!baseExists){
        return next(new Error("Base unit must have conversionToBase=1"));
    }
    next();
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;