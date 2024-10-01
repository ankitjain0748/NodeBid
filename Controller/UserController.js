const User = require('../Models/SignUp');
const { successResponse, errorResponse, validationErrorResponse } = require('../Helper/Message');

// Signup API
const signup = async (req, res) => {
    const { mpin, phone, username,role } = req.body;
    console.log("req", req.body);
    if ( !mpin || !phone || !username  || !role) {
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

module.exports = {
    signup,
    getotpsingup
};
