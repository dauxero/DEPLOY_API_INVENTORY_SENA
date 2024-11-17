import Order from "../Models/Order.js";
import Product from "../Models/Product.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { products, shippingAddress, paymentMethod } = req.body;

  if (products && products.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    try {
      let totalAmount = 0;
      const orderProducts = await Promise.all(
        products.map(async (item) => {
          const product = await Product.findById(item.product);
          if (product) {
            totalAmount += product.price * item.quantity;
            return {
              product: item.product,
              quantity: item.quantity,
              price: product.price,
            };
          } else {
            throw new Error("Product not found");
          }
        })
      );

      const order = new Order({
        user: req.user._id,
        products: orderProducts,
        shippingAddress,
        paymentMethod,
        totalAmount,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      if (req.body.status === "Delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
