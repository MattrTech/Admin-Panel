const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Add a Name"],
    },
    email: {
        type: String,
        required: [true, "Please Add An Email"],
        unique: true,
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Please Add A valid Email",
        ],
    },

    address: [{
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        pinCode: {
            type: String,
            required: true,
        },
    }],
    
    phone: {
        type: Number,
        required: [true, "Please add your Phone Number"],
    },
    
    mobileVerified: {
        type: Boolean,
    },
    
    password: {
        type: String,
        required: [true, "Please add a Password"],
        minlength: 6,
        select: false,
    },
    
    role: {
        type: String,
        enum: ["admin", "customer"],
        default: 'customer',
    },

    createdAt: {
        type: Date,
        default: Date.now(),
    },
}, {timestamps: true});

// Hashing Password before saving
UserSchema.pre("save", async function (next) {
    var salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password Matching from the database
UserSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password);
};

// Sign JWT and return - (is a method)
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

module.exports = mongoose.model("User", UserSchema);

