import Product from "../Models/Product.js";
import Order from "../Models/Order.js";

export const getInventoryReport = async (req, res) => {
  try {
    const products = await Product.find();
    const report = products.map((product) => ({
      name: product.name,
      quantity: product.quantity,
      value: product.price * product.quantity,
    }));
    const totalValue = report.reduce((sum, item) => sum + item.value, 0);
    res.json({ report, totalValue });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error generating inventory report",
        error: error.message,
      });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const orders = await Order.find({
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).populate("products.product");

    const salesMap = new Map();

    orders.forEach((order) => {
      order.products.forEach((item) => {
        const { name } = item.product;
        const quantity = item.quantity;
        const total = item.quantity * item.product.price;

        if (salesMap.has(name)) {
          const existingItem = salesMap.get(name);
          existingItem.quantity += quantity;
          existingItem.total += total;
        } else {
          salesMap.set(name, { name, quantity, total });
        }
      });
    });

    const report = Array.from(salesMap.values());
    const totalSales = report.reduce((sum, item) => sum + item.total, 0);

    res.json({ report, totalSales });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating sales report", error: error.message });
  }
};
