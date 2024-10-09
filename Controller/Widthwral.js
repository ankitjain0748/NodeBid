const { validationErrorResponse, successResponse } = require("../Helper/Message");
const withdrawal = require("../Models/Widthwral");
const User = require("../Models/SignUp");
const catchAsync = require("../utils/catchAsync");

const successAdd = catchAsync(async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        const { transcation_id, amount } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User information not found in the request or userId is undefined",
                status: false,
            });
        }
        if (!transcation_id || !amount) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Retrieve the user's account information
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: false,
            });
        }

        // Add the transaction amount to the user's balance
        user.amount = (user.amount || 0) + amount;
        await user.save();

        // Create a new transaction record
        const record = new withdrawal({
            transcation_id,
            amount,
            userId,
            payment_status:1
        });
        await record.save();

        res.status(200).json({
            data: record,
            status:true,
            message: "Transaction successful, amount added to balance",
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(false).json({ message: "Internal Server Error" });
    }
});

const withdrawalAdd = catchAsync(async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        const { upi_id, amount } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User information not found in the request or userId is undefined",
                status: false,
            });
        }
        if (!upi_id || !amount) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Retrieve the user's account information
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: false,
            });
        }

        // Check if the user has enough balance
        if (user.amount < amount) {
            return res.status(400).json({
                message: "Insufficient balance for withdrawal",
                status: false,
            });
        }

        // Deduct the amount from the user's balance
        user.amount -= amount;
        await user.save();

        // Create a new withdrawal record
        const record = new withdrawal({
            upi_id,
            amount,
            userId,
            payment_status :0
        });
        await record.save();

        res.status(200).json({
            data: record,
            message: "Withdrawal successful",
            status:true
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(false).json({ message: "Internal Server Error" });
    }
});

const amountget = catchAsync(async (req, res) => {
    try {
        const records = await withdrawal.find({});
        res.json({
            data: records,
            status:true,
            status: 200,
        });
    } catch (error) {
        console.error(error);
        res.status(false).json({ message: "Internal Server Error" });
    }
});

module.exports = {
    withdrawalAdd,
    successAdd,
    amountget,
};
