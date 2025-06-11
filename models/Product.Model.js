import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: String,
  
  price: { 
    type: Number, 
    required: true 
  },
  stock: { type: Number, 
    default: 1 
  },
  images: [String],
  
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category" 
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
