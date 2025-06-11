import ProductModel from "../models/Product.Model.js";
import UserModel from "../models/User.Model.js";
import sendErrorResponse from "../utils/sendError.js";
import sendResponse from "../utils/sendRes.js";
import { uploadFileToCloudinary } from "../utils/uploadFile.js";
import mongoose from "mongoose";



function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type)
}
//admin only
export const createProduct = async (req, res) => {
    try {
        //Todo: validation
        const { name, description, stock, price, category } = req.body
        if(!name, !description, !stock, !price, !category){
          return sendResponse(res, 400, false, "All feild are required")
        }
        //fetch file
        const id = req.user.id
        const file = req.files.imageFile
        if(!file){
          return sendResponse(res, 400, false, "Please provide at least one image")
        }

        const supportedType = ["jpg", "jpg", "png"];
        let fileType = file.name.split('.')[1].toLowerCase()
        

        if (!isFileTypeSupported(fileType, supportedType)) {
            return sendResponse(res, 400, false, "file format not supported")
        }

        //file format supported
        const response = await uploadFileToCloudinary(file, "ecom");

        const newProduct = await ProductModel.create({
            name,
            price,
            stock,
            images: response.secure_url,
            description,
            createdBy: id,
            category

        });

        await UserModel.findByIdAndUpdate(id, { $push: { createdProducts: newProduct._id } }, { new: true });

        return res.status(201).json({
            message: "Product created",
            success: true,
            product: newProduct
        })
    } catch (error) {
        console.log("Error in creating product", error)
        return sendErrorResponse(res, 500, error.message);
    }
}



export const getAllProducts = async (req, res) => {
    try {
        const AllProduct = await ProductModel.find();
        return res.status(200).json({
            message: "All product fetched successfully",
            success: true,
            AllProduct
        })
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
}

export const searchProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword;

        if (!keyword) {
            return sendResponse(res, 400, false, "Search keyword is required");
        }

        // Search with case-insensitive regex on name or description
        const products = await ProductModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        });

        if (products.length === 0) {
            return sendResponse(res, 404, false, "No products found matching your keyword");
        }

        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products,
        });

    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};




export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        // ✅ Check for valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return sendResponse(res, 400, false, "Invalid product ID format");
        }


        const findProduct = await ProductModel.findById(productId);

        if (!findProduct) {
            return sendResponse(res, 404, false, "Product not found");
        }

        return res.status(200).json({
            message: "Product fetched successfully",
            success: true,
            product: findProduct,
        });
    } catch (error) {
        return sendErrorResponse(res, 500, error.message);
    }
};


//admin onlu
export const updateProductByAdmin = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;
    const file = req.files?.imageFile;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return sendResponse(res, 400, false, "Invalid product ID");
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }

    if (product.createdBy.toString() !== userId.toString()) {
      return sendResponse(res, 403, false, "You are not allowed to update this product");
    }

    //  Build only fields to update
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (stock) updateData.stock = stock;
    if (category) updateData.category = category;

    // ✅ Handle file upload (optional)
    if (file) {
      const supportedType = ["jpg", "jpeg", "png"];
      const fileType = file.name.split(".").pop().toLowerCase();

      if (!isFileTypeSupported(fileType, supportedType)) {
        return sendResponse(res, 400, false, "file format not supported");
      }

      const response = await uploadFileToCloudinary(file, "ecom");
      updateData.image = response.secure_url; // or your image field
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      product: updatedProduct
    });

  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};





//admin only
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return sendResponse(res, 400, false, "Invalid product ID");
    }

    // Find product
    const product = await ProductModel.findById(productId);
    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }

    // Check ownership
    if (product.createdBy.toString() !== userId.toString()) {
      return sendResponse(res, 403, false, "You are not allowed to delete this product");
    }

    // Delete product
    await ProductModel.findByIdAndDelete(productId);

    // Remove product from user's createdProducts array
    await UserModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          createdProducts: productId,
        }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    return sendErrorResponse(res, 500, error.message);
  }
};

