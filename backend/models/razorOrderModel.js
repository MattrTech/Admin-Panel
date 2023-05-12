const mongoose = require("mongoose");

const RazorOrderSchema = new mongoose.Schema({
    id: String,
    entity: String,
    amount: Number,
    amount_paid: Number,
    amount_due: Number,
    currency: String,
    receipt: String,
    offer_id: String,
    status: String,
    attempts: Number,
    notes: mongoose.Schema.Types.Mixed,
    cartItems: mongoose.Schema.Types.Mixed,
    created_at: { type: String, default: new Date() },
});

module.exports = mongoose.model("RazorOrder", RazorOrderSchema);