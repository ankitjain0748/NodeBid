const Panna = require("../Models/Panna");
const moment = require('moment');
const catchAsync = require("../utils/catchAsync");

// Function to add a new Panna record
exports.pannaAdd = catchAsync(async (req, res, next) => {
    const userId = req?.user?.userId;
    const { type, status, date, digit, point } = req.body;

    // User ID validation
    if (!userId) {
        return res.status(400).json({
            message: "User information not found in the request or userId is undefined",
            status: false,
        });
    }

    // Required fields validation
    if (!type || !status || !date || !digit || !point) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    // Validate digit based on type
    if (type === "single_digit" || type === "double_digit") {
        if (!/^\d{1}$/.test(digit)) {
            return res.status(400).json({ message: "For digit type, digit must be a digit (0-9)!" });
        }
    } else if (type === "single_panna" || type === "double_panna") {
        if (!/^\d{2}$/.test(digit)) {
            return res.status(400).json({ message: "For panna type, digit must be a two-digit number (00-99)!" });
        }
    } else {
        return res.status(400).json({ message: "Invalid type provided!" });
    }

    // Parse the date
    const parsedDate = moment(date, "DD-MM-YYYY").add(1, 'day').utc().toDate();
    if (!parsedDate.isValid()) {
        return res.status(400).json({ message: "Invalid date format. Please use DD-MM-YYYY." });
    }

    // Create a new record
    const record = new Panna({
        type,
        status,
        date: parsedDate,
        digit,
        point,
        userId
    });
    
    await record.save();

    res.status(201).json({
        data: record,
        message: "Panna record added successfully.",
    });
});

// Function to list all Panna records
exports.pannalist = catchAsync(async (req, res) => {
    const records = await Panna.find({});

    res.status(200).json({
        data: records,
        message: "Records fetched successfully.",
    });
});
