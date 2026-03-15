import mongoose from "mongoose"
const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone:String,
    email: String,
    address: String,
    taxNumber: String,
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    notes: String

},
{timestamps: true}
);

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;