import mongoose from "mongoose";
const UnitSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    symbol:{
        type:String,
        required:true,
    },
    isFractional:{
        type:Boolean,
        default:false,
    }
}, {timestamps:true}
);

const Unit = mongoose.model("Unit", UnitSchema);
export default Unit;