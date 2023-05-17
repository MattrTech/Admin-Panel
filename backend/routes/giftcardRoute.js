const express = require('express');
const { createGiftCard, getAllGiftCards, getGiftCardByCode, deleteGiftCard } = require('../controllers/giftcardController');


const router = express.Router();

router
    .route('/')
    .post(createGiftCard)  // Create a new gift card
    .get(getAllGiftCards); // Get all gift cards

router
    .route('/:code')
    .get(getGiftCardByCode)  // Get gift card by code
    .delete(deleteGiftCard); // Delete gift card

module.exports = router;

