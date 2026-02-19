<<<<<<< HEAD
const Billing = require("../models/Billing");

// Create a new bill
exports.createBill = async (req, res) => {
    try {
        const { customerName, totalAmount } = req.body;

        if (!customerName || !totalAmount) {
            return res.status(400).json({ message: "Customer Name and Amount are required" });
        }

        const bill = await Billing.create({
            customerName,
            totalAmount,
            createdBy: req.user.id, // From authMiddleware
        });

        res.status(201).json(bill);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all bills
exports.getBills = async (req, res) => {
    try {
        const bills = await Billing.find().sort({ createdAt: -1 });
        res.json(bills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get single bill by ID
exports.getBillById = async (req, res) => {
    try {
        const bill = await Billing.findById(req.params.id);
        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }
        res.json(bill);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a bill
exports.updateBill = async (req, res) => {
    try {
        const { customerName, totalAmount } = req.body;

        const bill = await Billing.findByIdAndUpdate(
            req.params.id,
            { customerName, totalAmount },
            { new: true }
        );

        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }

        res.json(bill);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a bill
exports.deleteBill = async (req, res) => {
    try {
        const bill = await Billing.findByIdAndDelete(req.params.id);
        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }
        res.json({ message: "Bill deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
=======
const Bill = require("../models/Bill");

// Create a new bill
exports.createBill = async (req, res) => {
  try {
    const bill = new Bill(req.body);
    await bill.save();
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bill by ID
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update bill
exports.updateBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete bill
exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    res.json({ message: "Bill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
};
