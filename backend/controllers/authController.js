const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc  Register a user
// @route POST /api/auth/register
exports.register = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
  
    // Sending Token Response
    sendTokenResponse(user, 200, res);
});
  
// @desc  Register a user
// @route POST /api/v1/auth/login
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
  
    //Validate email and password
    if (!email || !password) {
      return next(new ErrorResponse(`Please provide an email and password`, 400));
    }
  
    //Check for user
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorResponse(`Invalid credentials`, 400));
    }
  
    //Check if Password Matches
    const isMatch = await user.matchPassword(password);
  
    if (!isMatch) {
      return next(new ErrorResponse(`Invalid credentials`, 400));
    }
  
    // Sending Token Response
    sendTokenResponse(user, 200, res);
});
  
// @desc  Get Logged in User
// @route POST /api/v1/auth/me
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
  
    if (!user) {
      return next(new ErrorResponse(`User not Found.`, 404));
    }
  
    res.status(200).json({ success: true, user });
});
  
// @desc  Update User
// @route POST /api/v1/auth/updateuser
exports.updateUser = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.user.id);
  
    if (!user) {
      return next(new ErrorResponse(`User not Found.`, 404));
    }
  
    user = await User.findByIdAndUpdate(req.user.id, req.body, {
      runValidators: true,
      new: true,
    });
  
    res.status(200).json({ success: true, user });
});
  
// @desc  Update Password
// @route POST /api/v1/auth/updatepassword
exports.updatePassword = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.user.id);
  
    if (!user) {
      return next(new ErrorResponse(`User not Found.`, 404));
    }
  
    const { enteredPassword, newPassword } = req.body;
  
    // Check if Current Password Matches Entered Password
    const isMatch = await user.matchPassword(enteredPassword);
  
    if (!isMatch) {
      return next(
        new ErrorResponse(`Password Does not Match. Please Check it Again`, 401)
      );
    }
  
    user = await User.findByIdAndUpdate(
      req.user.id,
      { password: newPassword },
      { runValidators: true, new: true }
    );
  
    res.status(200).json({ success: true, user });
});
  
// @desc  Logout user
// @route POST /api/v1/auth/logout
exports.logout = asyncHandler(async (req, res, next) => {
    res
      .status(200)
      .json({ success: true, message: "User Logged out Successfully." });
});
  
// Get Token from model,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
  
    res.status(statusCode).json({ success: true, token, user });
};