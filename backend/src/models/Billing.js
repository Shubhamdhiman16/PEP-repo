const mongoose = require("mongoose");

<<<<<<< HEAD
const billingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
});
=======
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
>>>>>>> 649a4f5627c18cda61aed714307f2bc5c61773d4

module.exports = mongoose.model("Billing", billingSchema);
