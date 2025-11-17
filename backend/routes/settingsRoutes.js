import express from "express";
import * as settingsController from "../controllers/settingsController.js";
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.use(verifyToken)
router.put("/profile", settingsController.updateProfile);
router.put("/password", settingsController.changePassword);

export default router;
