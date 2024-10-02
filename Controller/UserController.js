// File: UserController.js

const jwt = require("jsonwebtoken");
const User = require('../Models/SignUp');
const { promisify } = require("util");
const SECRET_ACCESS = process.env.SECRET_ACCESS;
const { successResponse, errorResponse, validationErrorResponse } = require('../Helper/Message');
const catchAsync = require('../utils/catchAsync');
const AppError = require("../utils/AppError");

// Sign Token
// const signToken = async (payload) => {
//     const token = jwt.sign(payload, SECRET_ACCESS, { expiresIn: "5h" });
//     return token;
// };

const signToken = async (payload) => {
    const token = jwt.sign(payload, SECRET_ACCESS, { expiresIn: "5h" });
    return token;
};
// User Signup
const signup = async (req, res) => {
    const { mpin, phone, username, role } = req.body;
    console.log("req", req.body);
    if (!mpin || !phone || !username || !role) {
        return validationErrorResponse(res, {
            mpin: 'MPIN is required',
            phone: 'Phone is required',
            username: 'Username is required',
            role: 'Role is required'
        });
    }
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return validationErrorResponse(res, { username: 'Username already exists' });
        }

        const phoneStr = String(phone);
        const newUser = new User({
            role,
            mpin,
            phone,
            phone_digit: phoneStr.slice(0, 4),
            username,
        });

        await newUser.save();
        return successResponse(res, { newUser }, "Please verify with OTP");
    } catch (error) {
        console.error(error);
        return errorResponse(res, "Error creating user");
    }
};

// OTP Verification
const getotpsingup = async (req, res) => {
    const { id, phone_digit } = req.body;
    console.log("req", req.body);

    if (!id || !phone_digit) {
        return validationErrorResponse(res, {
            id: 'User ID is required',
            phone_digit: 'Phone digit is required',
        });
    }
    try {
        const existingUser = await User.findOne({ _id: id, phone_digit });
        if (!existingUser) {
            return validationErrorResponse(res, { message: 'Invalid ID or phone digit' });
        }

        return successResponse(res, { existingUser }, "User verified successfully");
    } catch (error) {
        console.error(error);
        return errorResponse(res, "Error verifying user");
    }
};

// User Login
const login = catchAsync(async (req, res, next) => {
    const { phone, mpin } = req.body;
    if (!phone || !mpin) {
        return next(new Error("Phone and MPIN are required!"));
    }
    const user = await User.findOne({ phone, mpin });
    if (!user) {
        return res.json({
            status: false,
            message: "Invalid MPIN or phone",
        });
    }
    const token = await signToken({ id: user._id });

    res.json({
        status: true,
        message: "Login Successfully!",
        user,
        token,
    });
});

// Token Validation Middleware
const validateToken = catchAsync(async (req, res, next) => {
    console.log("req.headers.Authorization",req.headers?.authorization)
    let authHeader = req.headers.Authorization || req.headers.authorization;

    // Check if the Authorization header is present and starts with "Bearer"
    if (authHeader && authHeader.startsWith("Bearer ")) {
        let token = authHeader.split(" ")[1]; // Get the token from the header

        console.log("token",token)
        if (!token) {
            return next(new AppError("Token is missing", 403));
        }

        try {
            const decode = await promisify(jwt.verify)(token, key); // Verify the token
            console.log(decode)
            const result = await User.findById(decode.id); // Find the user
            console.log(result)

            if (!result) {
                return next(new AppError("User not found", 404));
            }

            req.user = result; // Set the user in the request object
            next(); // Proceed to the next middleware
        } catch (err) {
            return next(new AppError("Invalid token", 401)); // Handle invalid token
        }
    } else {
        return next(res.status(401).json({ status: false, msg: "Token is missing." }));
    }
});


// Get User Information
const user = catchAsync(async (req, res) => {
    if (req.user) {
        res.json({
            status: true,
            user: req.user,
        });
    } else {
        res.json({
            status: false,
            message: "You must be logged in first!",
        });
    }
});

// List Users
const userlist = catchAsync(async (req, res) => {
    const records = await User.find({});
    res.json({
        data: records,
        status: 200,
    });
});

// Exporting Functions
module.exports = {
    signup,
    getotpsingup,
    login,
    user,
    validateToken,
    userlist
};
