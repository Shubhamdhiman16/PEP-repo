const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billing.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Protect all routes
router.use(authMiddleware);

router.post("/", billingController.createBill);
router.get("/", billingController.getBills);
router.get("/:id", billingController.getBillById);
router.put("/:id", billingController.updateBill);
router.delete("/:id", billingController.deleteBill);

module.exports = router;
