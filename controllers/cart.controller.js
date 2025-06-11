import CartModel from "../models/Card.Model.js";
import mongoose from "mongoose";

// ✅ 1. Create Empty Cart 
export const createCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingCart = await CartModel.findOne({ user: userId });
    if (existingCart) {
      return res.status(400).json({ success: false, message: "Cart already exists" });
    }

    const newCart = await CartModel.create({ user: userId, items: [] });

    return res.status(201).json({ success: true, cart: newCart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ 2. Add Item to Cart
export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const cart = await CartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      return res.status(400).json({ message: "Product already in cart. Use update instead." });
    }

    cart.items.push({ product: productId, quantity });
    await cart.save();

    return res.status(200).json({ success: true, message: "Item added", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ 3. Update Item Quantity in Cart
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const cart = await CartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity = quantity;
    await cart.save();

    return res.status(200).json({ success: true, message: "Item updated", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ 4. Remove Item from Cart
export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await CartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    return res.status(200).json({ success: true, message: "Item removed", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ 5. Get User Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await CartModel.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
