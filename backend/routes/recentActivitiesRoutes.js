import express from "express";
import { verifyToken } from "../middleware/auth.js"
import { getRecentInventoryActivities } from "../controllers/recentActivitiesContoller.js";

const router = express.Router()

router.use(verifyToken)

router.get("/", getRecentInventoryActivities);



export default router;