const User = require('../Models/SignUp');
const { successResponse, errorResponse, validationErrorResponse } = require('../Helper/Message');

const signup = async (req, res) => {
    const { name, mpin, phone, username } = req.body;
    console.log("req", req.body);
    if (!name || !mpin || !phone || !username) {
        return validationErrorResponse(res, {
            name: 'Name is required',
            mpin: 'MPIN is required',
            phone: 'Phone is required',
            username: 'Username is required'
        });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return validationErrorResponse(res, { username: 'Username already exists' });
        }
        const phoneStr = String(phone);
        const newUser = new User({
            name,
            mpin,
            phone,
            phone_digit: phoneStr?.slice(0, 4),
            username,
        });
        await newUser.save();
        return successResponse(res, { newUser }, "User created successfully");
    } catch (error) {
        console.error(error);
        return errorResponse(res, "Error creating user");
    }
};



module.exports = {
    signup,
};
