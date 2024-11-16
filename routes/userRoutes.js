import express from "express";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { auth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, isAdmin, getUsers);
router.post("/", auth, isAdmin, addUser);
router.put("/:id", auth, isAdmin, updateUser);
router.delete("/:id", auth, isAdmin, deleteUser);

export default router;
