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

        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return validationErrorResponse(res, { phone: 'phone already exists' });
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

        res.status(200).json({
            data: newUser,
            message: "Please verify with OTP",
            status: true
        });
    } catch (error) {
        console.error(error);
        return errorResponse(res, "Error creating user");
    }
};

// OTP Verification
const getotpsingup = async (req, res) => {
    const { id, phone_digit } = req.body;

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
        const token = await signToken({ id: id });


        return successResponse(res, { existingUser, token }, "User verified successfully");
    } catch (error) {
        console.error(error);
        return errorResponse(res, "Error verifying user");
    }
};

// User Login
const login = catchAsync(async (req, res, next) => {
    try {
        const { phone, mpin } = req.body;

        // Check if phone and mpin are provided
        if (!phone || !mpin) {
            return res.status(400).json({
                status: false,
                message: "Phone and MPIN are required!",
            });
        }

        // Find user by phone and mpin
        const user = await User.findOne({ phone, mpin });

        // If user not found or mpin is incorrect
        if (!user) {
            return res.status(400).json({
                status: false,
                message: "Invalid MPIN or phone",
            });
        }

        // Check if user status is inactive
        if (user.user_status === 'inactive') {
            return res.status(403).json({
                status: false,
                message: "Your account is inactive. Please contact support.",
            });
        }

        // Sign a token if user is valid and active
        const token = await signToken({ id: user._id });

        res.status(200).json({
            status: true,
            message: "Login Successfully!",
            user,
            token,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
});


// Token Validation Middleware
const validateToken = catchAsync(async (req, res, next) => {
    let authHeader = req.headers.Authorization || req.headers.authorization;

    // Check if the Authorization header is present and starts with "Bearer"
    if (authHeader && authHeader.startsWith("Bearer ")) {
        let token = authHeader.split(" ")[1]; // Get the token from the header
        if (!token) {
            return next(new AppError("Token is missing", 403));
        }

        try {
            const decode = await promisify(jwt.verify)(token, SECRET_ACCESS); // Verify the token
            const result = await User.findById(decode.id); // Find the user

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
    const users = await User.find({ role: 'user' });
    res.json({
        data: users,
        status: true,
    });
});


const UserListId = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "User ID is required.",
            });
        }

        const record = await User.findById({ _id: id });

        if (!record || record.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No User found.",
            });
        }

        res.status(200).json({
            status: true,
            data: record,
            message: "User fetched successfully.",
        });
    } catch (error) {
        console.error("Error fetching User:", error);
        res.status(500).json({
            status: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
});



const userlistStatus = catchAsync(async (req, res) => {
    try {
        const users = await User.find({ user_status: 'inactive' });

        if (!users || users.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No inactive users found",
            });
        }

        res.status(200).json({
            status: true,
            data: users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    }
});


const updateUserStatus = catchAsync(async (req, res) => {
    try {
        const { _id, user_status } = req.body;
        console.log(req.body)
        // Validate the input
        if (!_id || !user_status) {
            return res.status(400).json({
                message: "User ID and status are required.",
                status: false,
            });
        }

        // Find the user by ID
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: false,
            });
        }

        // Update the user's status
        user.user_status = user_status;
        await user.save();

        res.status(200).json({
            message: `User status updated to ${user_status}`,
            status: true,
            data: user,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            message: "Internal Server Error",
            status: false,
        });
    }
});


// Controller to reset MPIN
const resetMpin = async (req, res) => {
    try {
        const { phone, newMpin } = req.body;

        // Validate input
        if (!phone || !newMpin) {
            return res.status(400).json({ message: 'User phone and new MPIN are required' });
        }

        // Fetch user from the database
        const user = await User.findOne({ phone: phone });
        
        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the new MPIN matches the old MPIN
        if (user.mpin === newMpin) {
            return res.status(400).json({ message: 'New MPIN cannot be the same as the old MPIN' });
        }

        // Update user's MPIN in the database (consider hashing it)
        user.mpin = newMpin; // You may want to hash this before saving
        await user.save(); // Ensure 'user' is a valid Mongoose document

        return res.status(200).json({ message: 'MPIN reset successfully' });
    } catch (error) {
        console.error('Error resetting MPIN:', error); // More descriptive error logging
        return res.status(500).json({ message: 'Internal server error' });
    }
};




// Exporting Functions
module.exports = {
    signup,
    getotpsingup,
    login,
    resetMpin,
    user,
    validateToken,
    updateUserStatus,
    userlist,
    UserListId,
    userlistStatus
};
