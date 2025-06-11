import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, required: true },
  }],
  totalAmount: Number,
  status: { type: String, enum: ["placed", "shipped", "delivered"], default: "placed" },
  address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
