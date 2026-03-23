import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true
  },

  shopName: {
    type: String,
    trim: true
  },

  panNumber:{
    type: String,
    unique: true,
  },

  phone: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    lowercase: true
  },

  address: {
    type: String,
    required: true,
  },

  customerType: {
    type: String,
    enum: ['retail', 'wholesale', 'vip'],
    default: 'retail'
  },

  creditLimit: {
    type: Number,
    default: 0
  },

  balanceDue: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

const Customer = mongoose.model("Customer", CustomerSchema);
export default Customer;
