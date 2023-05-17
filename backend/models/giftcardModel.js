const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('GiftCard', giftCardSchema);