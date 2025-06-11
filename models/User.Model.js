// models/User.js
import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter your name"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],

  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: { type: String },

  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],

  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],

  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart"
  },

  createdProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]

}, { timestamps: true });






export default mongoose.model("User", userSchema);