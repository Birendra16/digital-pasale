import mongoose from "mongoose";

const UnitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // "Carton", "Bottle"
        trim: true
    },

    shortName: {
        type: String, // "ctn", "btl", "kg"
        required: true
    },

    // type: {
    //     type: String,
    //     enum: ["bigger", "smaller", "base"],
    //     required: true
    // },

    // description: {
    //     type: String
    // }

}, { timestamps: true });

const Unit = mongoose.model("Unit", UnitSchema);
export default Unit;