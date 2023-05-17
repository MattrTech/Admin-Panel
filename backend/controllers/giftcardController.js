const GiftCard = require("../models/giftcardModel");
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require("../middlewares/async");

// @desc Create a new gift card
// @route
exports.createGiftCard = asyncHandler( async (req,res) => {
    try {
        const { code, balance, expiryDate } = req.body;
        const giftCard = new GiftCard({ code, balance, expiryDate });
        const savedGiftCard = await giftCard.save();
        res.status(201).json(savedGiftCard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// @desc Get all gift cards
// @route
exports.getAllGiftCards = asyncHandler( async (req,res) => {
    try {
        const giftCards = await GiftCard.find();
        res.status(200).json(giftCards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong'});
    }
});

// @desc Get gift card by code
// @route
exports.getGiftCardByCode = asyncHandler( async (req,res) => {
    try {
        const giftCard = await GiftCard.findOne({ code: req.params.code });

        if (!giftCard) {
            return res.status(404).json({ message: 'Gift card not found' });
        }

        res.status(200).json(giftCard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// @desc Delete gift card
// @route
exports.deleteGiftCard = asyncHandler( async (req,res) => {
    try {
        const giftCard = await GiftCard.findOneAndDelete({ code: req.params.code });
        if (!giftCard) {
            return res.status(404).json({ message: 'Gift card not found' });
        }
        res.status(200).json({ message: 'Gift card deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
})