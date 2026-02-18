const express = require("express");
const router = express.Router();
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


module.exports = router;
