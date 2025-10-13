import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productionRoutes from "./routes/productionRoutes.js";
import procurementRoutes from "./routes/procurementRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/production", productionRoutes);
app.use("/api/procurement", procurementRoutes);
app.use("/api/sales", salesRoutes);

// Health check
app.get("/", (req, res) => res.send("Server is running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
