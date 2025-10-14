import express from "express"
import * as production from "../controllers/productionController.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.use(verifyToken)

router.get("/", production.getBatches)
router.post("/", production.createBatch)
router.delete("/:id", production.deleteBatch)
router.put("/:id", production.updateBatch)

export default router
