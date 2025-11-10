import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getInventoryMovements } from "../controllers/inventorymovementsController.js";

const router = express.Router();

router.use(verifyToken)

router.get("/", getInventoryMovements);

export default router