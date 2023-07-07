const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const UserModel = require("../models/userModel");

// Protect routes
exports.protect = asyncHandler(async (req,res,next) => {
    let token;
    console;

    if (req.headers["x-auth-token"]) {
        token = req.headers["x-auth-token"];
    }

    if (!token) {
        //   Make sure token exists
        return next(
            new ErrorResponse(`Not authorized to access this route.`, 401)
        );
    }

    try {
        // Verify valid token and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        // Verify if the user exists
        const user = await UserModel.findById(decoded.id);
        req.user = user;
        res.locals.user = user;
        res.locals.id = decoded.id;
        next();
    } catch (error) {
        return next(
            new ErrorResponse(`Not authorized to access this route.`, 401)
        );
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(res.locals.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${res.locals.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};
