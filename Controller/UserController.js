const jwt = require("jsonwebtoken");
const User = require('../Models/SignUp');

const { promisify } = require("util");
const SECRET_ACCESS = process.env && process.env.SECRET_ACCESS;
const key = process && process.env && process.env.SECRET_ACCESS;
const { successResponse, errorResponse, validationErrorResponse } = require('../Helper/Message');
const catchAsync = require('../utils/catchAsync');

// Signup API

const signToken = async (payload) => {
    const token = jwt.sign(payload, SECRET_ACCESS, { expiresIn: "5h" });
    return token;
};


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
            phone_digit: phoneStr?.slice(0, 4),
            username,
        });

        await newUser.save();
        return successResponse(res, { newUser }, " please verify with OTP");
    } catch (error) {
        console.error(error);
        return errorResponse(res, "Error creating user");
    }
};

// OTP Verification API
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

const login = catchAsync(async (req, res, next) => {
    const { phone, mpin } = req.body;
    // console.log("email",email)
    if (!phone || !mpin) {
        return next(new AppError("phone and mpin is required !!", 401));
    }
    const user = await User.findOne({ phone: phone, mpin: mpin });
    if (!user) {
        res.json({
            status: false,
            message: "Invalid mpin or phone",
        });
    }
    const token = await signToken({
        id: user && user._id,
    });

    res.json({
        status: true,
        message: "Login Successfully !!",
        user: user,
        token,
    });
});

exports.validateToken = catchAsync(async (req, res, next) => {
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      let token = authHeader.split(" ")[1];
      if (!token) {
        next(new AppError("User is not authorized or token is missing", 403));
      }
      const decode = await promisify(jwt.verify)(token, key);
      if (decode) {
        let result = await User.findById(decode.id);
        req.user = result;
        next();
      } else {
        next(new AppError("User is not authorized", 401));
      }
    } else {
      next(res.status(401).json({ status: false, msg: "Token is missing." }));
    }
  });
  


const user = catchAsync(async (req, res) => {
    if (req.user) {
        res.json({
            status: true,
            user: req.user,
        });
    } else {
        res.json({
            status: false,
            message: "You must be log in first !!.",
        });
    }
});


const userlist = catchAsync(
    async (req, res) => {
        const record = await User.find({})
        res.json({
            data: record,
            status: 200,
        });
    }
)
module.exports = {
    signup,
    getotpsingup, login, validateToken, user, userlist
};
