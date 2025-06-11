import express from "express";
import { addItemToCart, createCart, getCart, removeItemFromCart, updateCartItem } from "../controllers/cart.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";

const cartRoute = express.Router();

cartRoute.post("/create", authMiddleware, createCart);
cartRoute.post("/add", authMiddleware, addItemToCart);
cartRoute.put("/update", authMiddleware, updateCartItem);
cartRoute.delete("/remove/:productId", authMiddleware, removeItemFromCart);
cartRoute.get("/mycart", authMiddleware, getCart);

export default cartRoute;
