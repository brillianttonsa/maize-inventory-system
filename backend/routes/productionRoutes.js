import express from "express"
import * as productionRoute from "../controllers/productionController.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.use(verifyToken)

router.get("/", productionRoute.getBatches)
router.post("/", productionRoute.createBatch)
router.delete("/:id", productionRoute.deleteBatch)
router.put("/:id", productionRoute.updateBatch)

export default router
