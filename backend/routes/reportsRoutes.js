import express from "express";
import { generateReport } from "../controllers/reportsController.js";
import { generateComprehensiveReport } from "../controllers/comprehensiveReportController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// All report routes require authentication
router.post("/generate", verifyToken, generateReport);
router.get("/comprehensive", verifyToken, generateComprehensiveReport);

export default router;
