import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema({
  inventory:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",
    required:true,
  },
  productName: String,
  sku: String,

  unitQuantity : {
    type: Number,
    default: 0,
  },

   subUnitQuantity: {
    type: Number,
    default: 0,
  },

  totalSubUnits: {
    type: Number,
    required: true,
  },

  sellingPricePerUnit: Number,
  sellingPricePerSubUnit: Number,

  totalAmount: {
    type: Number,
    required: true,
  },

  note: String,

})

const saleSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    items: [saleItemSchema],

    totalAmount: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    dueAmount: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["paid", "partial", "due"],
      default: "paid",
    },

    note: String,

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Sales = mongoose.model("Sale", saleSchema);
export default Sales;