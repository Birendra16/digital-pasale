import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },

    password: { 
      type: String, 
      required: true, 
      select: false 
    },

    role: {
      type: String,
      enum: ["ADMIN", "OWNER", "STAFF"],
      default: "OWNER",
    },

    status: {
      type: String,
      enum: ["PENDING", "ACTIVE","REJECTED"],
      default: "PENDING",
    },

    subscription: {
      type: String,
      enum: ["TRIAL", "ACTIVE", "EXPIRED"],
      default: "TRIAL",
    },

    trialEnd: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  if (!this.password) throw new Error("Password not loaded");
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;