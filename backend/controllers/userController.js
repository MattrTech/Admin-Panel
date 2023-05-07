const User = require('../models/userModel');
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middlewares/async');

// @desc Get All User
// @route GET /api/v1/user
exports.getAllUsers = asyncHandler(async (req,res,next) => {
    try {
        const user = await User.find();
        res.status(200).json({ success: true, count: user.length, data: user });
    } catch (error) {
        return next(new ErrorResponse(error.message, 404));
    }
});

// @desc Get User with a specific id
// @route GET /api/v1/user/:id
exports.getUserById = asyncHandler(async (req,res,next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.status(200).json({ success: true, data: user });
        } else {
            return next(new ErrorResponse("User not Found", 404));
        }
    } catch (error) {
        return next(new ErrorResponse(error.message, 500));
    };
});

// @desc Create a User
// @route POST /api/v1/user
exports.createUser = asyncHandler(async (req,res, next) => {
    const user = await User.create(req.body);

    try {
        res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: user,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc Update
// @route PUT /api/v1/user/:userId
exports.updateUserById = asyncHandler(async (req,res, next) => {
    try {
       let user = await User.findById(req.params.id); 
       if (!user) {
        return next(new ErrorResponse("User not Found", 404));
       }
       user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
       });
       res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: user,
       });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// @desc Delete
// @route DELETE /api/v1/user/:userId
exports.deleteUserById = asyncHandler(async (req,res,next) => {
    try {
        let user = await User.findById(req.params.id);
        
        if (!user) {
            return next(new ErrorResponse("User not Found", 404));
        }

        user = await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "User Deleted Successfully" });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});