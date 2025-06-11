import categoryModel from "../models/category.model.js";

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Basic validation
        if (!name || !description) {
            return res.status(400).json({
                message: "Name and description are required",
                success: false
            });
        }

        // Create category
        const category = await categoryModel.create({
            name,
            description
        });

        return res.status(201).json({
            message: "Category created",
            success: true,
            category
        });
    } catch (error) {
        console.error("Error in createCategory:", error.message);
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: error.message
        });
    }
};


export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields to update." });
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      categoryId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory
    });

  } catch (error) {
    console.error("Update Category Error:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deleted = await categoryModel.findByIdAndDelete(categoryId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {
    console.error("Delete Category Error:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      categories
    });

  } catch (error) {
    console.error("Get All Categories Error:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


export const getSingleCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await categoryModel.findById(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      category
    });

  } catch (error) {
    console.error("Get Single Category Error:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
