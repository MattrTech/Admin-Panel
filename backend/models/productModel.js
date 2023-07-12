const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    sortOrder: {
        type: Number,
    },
    variations: {
        color: {
          type: [String],
          default: "user.jpg",
          enum: ["White", "Red", "Black", "Blue", "Yellow"],
        },
        size: {
            type: mongoose.Schema.Types.Mixed,
        },
    },
    stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
    },
    category: {
        type: String,
        enum: ['Heels', 'Shoes', 'Flats', 'Accessories', 'Other'],
        required: true,
    },
    total_price: {
        type: Number,
        required: true,
    },
    image: {
        type: [String],
        default: "user.jpg",
    },
    reviews: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        rating: {
          type: Number,
          required: true
        },
        comment: {
          type: String,
          required: true
        }
    }],
    quantity: {
        type: Number,
    }
}, {timestamps: true});

module.exports = mongoose.model("Product", ProductSchema);