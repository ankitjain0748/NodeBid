const Panna = require("../Models/Panna")
const moment = require('moment');
const catchAsync = require("../utils/catchAsync")

const pannaAdd = catchAsync(async (req, res, next) => {
    try {
        const userId = req?.user?.userId;
        const { type, status, date, digit, point } = req.body;
        if (!userId) {
            return res.status(400).json({
                message: "User information not found in the request or userId is undefined",
                status: false,
            });
        }
        if (!type || !status || !date || !digit || !point) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Validate digit based on type
        if (type === "single_digit" || type === "double_digit") {
            if (!/^\d{1}$/.test(digit)) {
                return res.status(400).json({ message: "For digit type, digit must be a  digit (0-9)!" });
            }
        } else if (type === "single_panna") {
            if (!/^\d{2}$/.test(digit)) {
                return res.status(400).json({ message: "For paana type, digit must be a two-digit number (00-99)!" });
            }
        } else {
            return res.status(400).json({ message: "Invalid type provided!" });
        }

        // Parse the date
        const parsedDate = moment(date, "DD-MM-YYYY").add(1, 'day').utc().toDate();
        console.log("parsedDate", parsedDate);

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

        res.status(200).json({
            data: record,
            message: "Success",
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Internal Server Error" });
    }
});


const pannalist = catchAsync(
    async (req, res) => {
        const record = await Panna.find({})
        res.json({
            data: record,
            status: 200,
        });
    }
)

module.exports = {
    pannaAdd, pannalist
};
