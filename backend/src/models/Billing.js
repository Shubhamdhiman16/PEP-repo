const mongoose = require("mongoose");

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

module.exports = mongoose.model("Billing", billingSchema);
