import Order from "../models/Order.model.js";
import Cart from "../models/Card.Model.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("Request Body:", req.body);
   

    // 1. Get user’s cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
   
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // 2. Calculate total amount
    const totalAmount = cart.items.reduce((acc, item) => {

      return acc + item.product.price * item.quantity;
    }, 0);

    // 3. Create new order
    const newOrder = new Order({
      user: userId,
      products: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      totalAmount,
      address: req.body.address, // pass addressId in request
    });

    await newOrder.save();

    // 4. Clear the cart
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    // 5. Send success response
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder
    });
  } catch (err) {
    console.error("Order Placement Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
//User only
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .populate("address");

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("products.product")
      .populate("address");

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
