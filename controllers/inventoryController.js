import Product from "../Models/Product.js";
import InventoryMovement from "../Models/InventoryMovement.js";

export const registerEntry = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.quantity += quantity;
    await product.save();

    const movement = new InventoryMovement({
      product: productId,
      type: "entry",
      quantity,
      user: req.user.userId,
    });
    await movement.save();

    res
      .status(201)
      .json({ message: "Entry registered successfully", product, movement });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const registerExit = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient quantity" });
    }

    product.quantity -= quantity;
    await product.save();

    const movement = new InventoryMovement({
      product: productId,
      type: "exit",
      quantity,
      user: req.user.userId,
    });
    await movement.save();

    res
      .status(201)
      .json({ message: "Exit registered successfully", product, movement });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getInventoryHistory = async (req, res) => {
  try {
    const history = await InventoryMovement.find()
      .populate("product", "name")
      .populate("user", "email")
      .sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
