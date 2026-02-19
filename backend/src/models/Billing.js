const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
            trim: true,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Billing", billingSchema);
