const cors = require("cors");
const express = require("express");

const authRoutes = require("./routers/auth.routes");
const billingRoutes = require("./routers/billing.routes");
const productRoutes = require("./routers/product.routes");
const reportsRoutes = require("./routers/reports.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Billing System API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reports", reportsRoutes);

// 404 handler — returns JSON instead of HTML
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Internal Server Error" });
});

module.exports = app;
