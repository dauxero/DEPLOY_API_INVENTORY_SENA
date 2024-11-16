import express from "express";
import {
  registerEntry,
  registerExit,
  getInventoryHistory,
} from "../controllers/inventoryController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/entry", auth, registerEntry);
router.post("/exit", auth, registerExit);
router.get("/history", auth, getInventoryHistory);

export default router;
