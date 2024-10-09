const Panna = require("../Models/Panna");
const moment = require('moment');
const catchAsync = require("../utils/catchAsync");

// Function to add a new Panna record
exports.pannaAdd = catchAsync(async (req, res, next) => {
    const userId = req?.user?._id;
    const { type, status, date, digit, point, marketId } = req.body;

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
    if (type === "single_digit") {
        if (!/^\d{1}$/.test(digit)) {
            return res.status(400).json({ message: "For type 'single_digit', digit must be a single digit (0-9)!" });
        }
    } else if (type === "single_panna" || type === "double_panna") {
        if (!/^\d{3}$/.test(digit)) {
            return res.status(400).json({ message: "For type 'single_panna' or 'double_panna', digit must be a three-digit number (000-999)!" });
        }
    } else if (type === "double_digit") {
        if (!/^\d{2}$/.test(digit)) {
            return res.status(400).json({ message: "For type 'double_digit', digit must be a two-digit number (00-99)!" });
        }
    } else {
        return res.status(400).json({ message: "Invalid type provided!" });
    }

    // Parse the date
    const parsedDate = moment(date, "DD-MM-YYYY", true);
    if (!parsedDate.isValid()) {
        return res.status(400).json({ message: "Invalid date format. Please use DD-MM-YYYY." });
    }

    // Create a new record
    const record = new Panna({
        type,
        status,
        date: parsedDate.add(1, 'day').utc().toDate(),
        digit,
        point,
        userId,
        marketId
    });

    await record.save();

    res.status(201).json({
        status:true,
        data: record,
        message: "Panna record added successfully.",
    });
});


// Function to list all Panna records
exports.pannalist = catchAsync(async (req, res) => {
    const records = await Panna.find({}).sort({ date: -1 });

    res.status(200).json({
        data: records,
        message: "Records fetched successfully.",
    });
});

