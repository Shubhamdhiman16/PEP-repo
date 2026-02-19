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
};
