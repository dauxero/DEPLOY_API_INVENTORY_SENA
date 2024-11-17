import Product from "../Models/Product.js";
import Order from "../Models/Order.js";

export const getInventoryReport = async (req, res) => {
  try {
    const products = await Product.find({});
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
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $in: ["Delivered", "Shipped"] }, // Only consider completed orders
    }).populate("products.product");

    const salesByProduct = {};
    orders.forEach((order) => {
      order.products.forEach((item) => {
        if (salesByProduct[item.product._id]) {
          salesByProduct[item.product._id].quantity += item.quantity;
          salesByProduct[item.product._id].total += item.quantity * item.price;
        } else {
          salesByProduct[item.product._id] = {
            name: item.product.name,
            quantity: item.quantity,
            total: item.quantity * item.price,
          };
        }
      });
    });

    const report = Object.values(salesByProduct);
    const totalSales = report.reduce((sum, item) => sum + item.total, 0);

    res.json({ report, totalSales });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating sales report", error: error.message });
  }
};
