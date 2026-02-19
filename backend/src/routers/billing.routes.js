const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const billingController = require("../controllers/billing.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Protect all routes
router.use(authMiddleware);

router.post("/", billingController.createBill);
router.get("/", billingController.getBills);
router.get("/:id", billingController.getBillById);
router.put("/:id", billingController.updateBill);
router.delete("/:id", billingController.deleteBill);
=======
const {
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill,
} = require("../controllers/billing.controller");

// Create a new bill
router.post("/", createBill);

// Get all bills
router.get("/", getAllBills);

// Get bill by ID
router.get("/:id", getBillById);

// Update bill
router.put("/:id", updateBill);

// Delete bill
router.delete("/:id", deleteBill);
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a

module.exports = router;
