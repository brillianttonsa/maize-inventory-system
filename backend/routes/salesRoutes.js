import express from "express";
import * as salesController from "../controllers/salesController.js";
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.use(verifyToken)

router.get("/", salesController.getSales);
router.post("/", salesController.createSale);
router.put("/:id", salesController.updateSale);
router.delete("/:id", salesController.deleteSale);

export default router;
