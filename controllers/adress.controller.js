
import addressModel from "../models/adress.model.js";
import UserModel from "../models/User.Model.js";

export const addAdress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, street, city, state, zipCode, country } = req.body;

    // ✅ Simple Validation
    if (!fullName || !phone || !street || !city || !state || !zipCode || !country) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required",
      });
    }

    // ✅ Create Address
    const address = await addressModel.create({
      fullName,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      user: userId,
    });

    // ✅ Add to user's address array
    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { addresses: address._id } },
      { new: true }
    );

    // ✅ Response
    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });

  } catch (error) {
    console.error("Address Add Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding address",
    });
  }
};



export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    // Allowed fields
    const allowedFields = ["fullName", "phone", "street", "city", "state", "zipCode", "country"];

    // Dynamic update object
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field]) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update." });
    }

    const updatedAddress = await addressModel.findOneAndUpdate(
      { _id: addressId, user: userId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ success: false, message: "Address not found." });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    // ✅ Remove from address collection
    const deleted = await addressModel.findOneAndDelete({ _id: addressId, user: userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    // ✅ Also remove from user's address array
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { addresses: addressId },
    });

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getMyAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await UserModel.findById(userId).populate({
      path: "addresses",
      select: "-__v -createdAt -updatedAt",
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};



