import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrderStatus,
} from "../controllers/order.controller.js";
import { validateOrder } from "../middleware/validation.js";

const router: Router = Router();

router.post("/", ...validateOrder, createOrder);
router.get("/:id", getOrderById);
router.get("/:id/status", getOrderStatus);

export default router;
