import mongoose from "mongoose"
const subUnitSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true,
        unique:true,
    },
    shortName:{
        type: String,
        required:true,
        trim:true,
    },

    // // Parent Unit
    // unit:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"Unit",
    //     required:true,
    // },
    // conversion: {
    //     type: Number,
    //     required:true,
    // },
},
{timestamps: true}
)
const SubUnit = mongoose.model("SubUnit", subUnitSchema)
export default SubUnit;