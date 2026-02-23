const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");

// AI Routes
router.post("/analyze-invoice", aiController.analyzeInvoice);
router.get("/predict-sales", aiController.predictSales);
router.get("/predict-inventory", aiController.predictInventory);
router.get("/detect-anomalies", aiController.detectAnomalies);
router.get("/search", aiController.search);
router.get("/customer-insights", aiController.getCustomerInsights);
router.get("/auto-categorize", aiController.autoCategorize);

module.exports = router;
