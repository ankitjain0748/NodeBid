const sanagam = require("../Models/Sangam");
const User = require("../Models/SignUp")
const moment = require('moment');
const GameRate = require("../Models/GameRate")
const catchAsync = require("../utils/catchAsync");


exports.SangamAdd = catchAsync(async (req, res, next) => {
    try {
        const userId = req?.user?._id;
        const { type, status, date, open_panna, close_panna, bid_point, marketId } = req.body;

        // User ID validation
        if (!userId) {
            return res.status(400).json({
                message: "User information not found in the request or userId is undefined.",
                status: false,
            });
        }

        // Required fields validation
        // if (!type || !status || !date || !open_panna || !close_panna || !bid_point) {
        //     return res.status(400).json({
        //         status: false,
        //         message: "All fields are required!",
        //     });
        // }

        // Validate the type and corresponding open_panna and close_panna fields
        // if (type === "half_sangam" || type === "full_sangam") {
        //     const pannaPattern = /^\d{3}$/; // three-digit number validation (000-999)
        //     if (!pannaPattern.test(open_panna)) {
        //         return res.status(400).json({
        //             status: false,
        //             message: `For type '${type}', open_panna and close_panna must both be three-digit numbers (000-999).`,
        //         });
        //     }
        // } else {
        //     return res.status(400).json({
        //         status: false,
        //         message: "Invalid type provided!",
        //     });
        // }

        // Parse the date with moment.js and validate
        const parsedDate = moment(date, "DD-MM-YYYY", true);
        if (!parsedDate.isValid()) {
            return res.status(400).json({
                status: false,
                message: "Invalid date format. Please use DD-MM-YYYY.",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found.",
            });
        }

        // Check if the user has enough balance to place the bet
        if (user.amount < bid_point) {
            return res.status(400).json({
                status: false,
                message: "Insufficient balance to place the bet.",
            });
        }

        // Deduct the points from the user's amount
        user.amount -= bid_point;
        await user.save();

        // Create and save the new record
        const record = new sanagam({
            type,
            status,
            date: parsedDate, // Adjust date as per requirement
            open_panna,
            close_panna,
            bid_point,
            userId,
            marketId,
        });

        await record.save();

        // Send success response
        res.status(201).json({
            data: record,
            status: true,
            message: `${type?.replace("_" ," ")} Bid successfully.`,
        });

    } catch (error) {
        console.error("Error adding Sangam record:", error);

        // Send error response
        res.status(500).json({
            status: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
});




exports.GameRateAdd = catchAsync(async (req, res, next) => {
    try {
        const { single_digit_rate,
            doble_digit_rate,
            Single_panna_rate,
            Doble_panna_rate,
            Triple_panna_rate,
            full_sangam,
            Half_sangam,
            Digit_on,
            dp_motors } = req.body;


        // Create and save the new record
        const record = new GameRate({
            single_digit_rate,
            doble_digit_rate,
            Single_panna_rate,
            Doble_panna_rate,
            Triple_panna_rate,
            full_sangam,
            Half_sangam,
            Digit_on,
            dp_motors
        });

        await record.save();

        // Send success response
        res.status(201).json({
            data: record,
            status: true,
            message: "GameRate record added successfully.",
        });

    } catch (error) {
        console.error("Error adding GameRate record:", error);

        // Send error response
        res.status(500).json({
            status: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
});

