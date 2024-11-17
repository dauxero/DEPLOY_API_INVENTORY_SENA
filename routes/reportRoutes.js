import express from "express";
import {
  getInventoryReport,
  getSalesReport,
} from "../controllers/reportController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All report routes should be protected

router.get("/inventory", admin, getInventoryReport);
router.get("/sales", admin, getSalesReport);

export default router;
