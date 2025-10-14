import express from "express";
import * as controller from "../controllers/procurementController.js";
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.use(verifyToken)

router.get("/", controller.getOrders);
router.post("/", controller.createOrder);
router.put("/:id", controller.updateOrder);
router.delete("/:id", controller.deleteOrder);

export default router;
