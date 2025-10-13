import express from "express";
import * as controller from "../controllers/procurementController.js";

const router = express.Router();

router.get("/", controller.getOrders);
router.get("/:id", controller.getOrderById);
router.post("/", controller.createOrder);
router.put("/:id", controller.updateOrder);
router.delete("/:id", controller.deleteOrder);

export default router;
