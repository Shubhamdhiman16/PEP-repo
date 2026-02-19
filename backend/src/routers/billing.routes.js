const express = require("express");
const router = express.Router();
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

module.exports = router;
