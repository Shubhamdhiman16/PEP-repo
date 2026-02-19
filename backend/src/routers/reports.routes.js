const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reports.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Protect all routes
router.use(authMiddleware);

// Only Admins can view reports
router.get("/dashboard-stats", roleMiddleware(["admin"]), reportsController.getDashboardStats);
router.get("/monthly-sales", roleMiddleware(["admin"]), reportsController.getMonthlySales);

module.exports = router;
