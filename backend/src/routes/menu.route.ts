import { Router } from "express";
import {
  getAllMenuItems,
  getMenuItemById,
} from "../controllers/menu.controller.ts";

const router: Router = Router();

router.get("/", getAllMenuItems);
router.get("/:id", getMenuItemById);

export default router;
