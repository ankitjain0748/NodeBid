const { validationErrorResponse, successResponse } = require("../Helper/Message");
const PaymentSuccess = require("../Models/PaymentSuccess");
const withdrawal = require("../Models/Widthwral");

const catchAsync = require("../utils/catchAsync");



const withdrawalAdd = catchAsync(async (req, res, next) => {
    try {
        const userId = req?.user?.userId;
        const { upi_id, amount } = req.body;
        // if (!userId) {
        //     return res.status(400).json({
        //         message: "User information not found in the request or userId is undefined",
        //         status: false,
        //     });
        // }
        if (!upi_id || !amount) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const record = new withdrawal({
            upi_id, amount,
            userId
        });
        await record.save();

        res.status(200).json({
            data: record,
            message: "Success",
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Internal Server Error" });
    }
});


const successAdd = catchAsync(async (req, res, next) => {
    try {
        const userId = req?.user?.userId;
        const { transcation_id, amount } = req.body;
        // if (!userId) {
        //     return res.status(400).json({
        //         message: "User information not found in the request or userId is undefined",
        //         status: false,
        //     });
        // }
        if (!transcation_id || !amount) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const record = new PaymentSuccess({
            transcation_id, amount,
            userId
        });
        await record.save();

        res.status(200).json({
            data: record,
            message: "Success",
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Internal Server Error" });
    }
});
module.exports = {
    withdrawalAdd,successAdd
};
