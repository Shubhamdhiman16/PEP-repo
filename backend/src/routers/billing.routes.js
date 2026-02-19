const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const Billing = require("../models/Billing");

// Create bill
router.post("/", async (req, res) => {
  try {
    const bill = new Billing(req.body);
    await bill.save();
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: "Error creating bill" });
  }
});

// Get all bills
router.get("/", async (req, res) => {
  try {
    const bills = await Billing.find();
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bills" });
  }
});

// Delete bill
router.delete("/:id", async (req, res) => {
  try {
    await Billing.findByIdAndDelete(req.params.id);
    res.json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting bill" });
  }
});

// Update bill
router.put("/:id", async (req, res) => {
  try {
    const bill = await Billing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: "Error updating bill" });
  }
});

=======
const billingController = require("../controllers/billing.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Protect all routes
router.use(authMiddleware);

router.post("/", billingController.createBill);
router.get("/", billingController.getBills);
router.get("/:id", billingController.getBillById);
router.put("/:id", billingController.updateBill);
router.delete("/:id", billingController.deleteBill);
>>>>>>> 649a4f5627c18cda61aed714307f2bc5c61773d4

module.exports = router;
