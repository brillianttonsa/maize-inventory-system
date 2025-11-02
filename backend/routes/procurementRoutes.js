import express from "express";
import * as procurementRoute from "../controllers/procurementController.js";
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.use(verifyToken)

router.get("/", procurementRoute.getOrders);
router.post("/", procurementRoute.createOrder);
router.put("/:id", procurementRoute.updateOrder);
router.delete("/:id", procurementRoute.deleteOrder);

export default router;
