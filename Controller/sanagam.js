const sanagam = require("../Models/Sangam");
const moment = require('moment');
const catchAsync = require("../utils/catchAsync");


exports.SangamAdd = catchAsync(async (req, res, next) => {
    const userId = req?.user?._id;
    const { type, status, date, open_panna, open_panna_sum, close_panna, bid_point } = req.body;

    // User ID validation
    if (!userId) {
        return res.status(400).json({
            message: "User information not found in the request or userId is undefined",
            status: false,
        });
    }

    // Required fields validation
    if (!type || !status || !date || !open_panna || !open_panna_sum || !close_panna || !bid_point) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    // Validate bid_point
    if (!/^\d{5}$/.test(bid_point)) {
        return res.status(400).json({ message: "For type 'bid_point', it must be a five-digit number!" });
    }

    // Validate digit based on type
    if (type === "half_sangam" || type === "full_sangam") {
        if (!/^\d{3}$/.test(close_panna) || !/^\d{3}$/.test(open_panna)) {
            return res.status(400).json({ message: `For type '${type}', open_panna and close_panna must both be three-digit numbers (000-999).` });
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
    const record = new sanagam({
        type,
        status,
        date: parsedDate.add(1, 'day').utc().toDate(), // Only include parsedDate here
        open_panna,
        open_panna_sum,
        close_panna,
        bid_point,
        userId
    });

    await record.save();

    res.status(201).json({
        data: record,
        message: "Sangam record added successfully.",
    });
});

