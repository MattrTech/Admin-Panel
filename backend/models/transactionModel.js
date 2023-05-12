const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  item_name: {
    type: String,
  },

  total_amount: {
    type: Number,
  },
  item_category: {
    type: String,
  },

  payment_mode: {
    type: String,
    enum: ["cod", "online"],
  },

  transacton_date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);