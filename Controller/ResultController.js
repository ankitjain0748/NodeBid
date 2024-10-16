const  resultmodel = require("../Models/Result");
const catchAsync = require("../utils/catchAsync");


exports.ReusltAdd = async (req, res) => {
    try {
        const { session , number, betdate, market_id } = req.body;
        const data = new resultmodel({
            session , number, betdate, market_id 
        });
        const result = await data.save();
        if (result) {
            res.json({
                status: 200,
                message: "success"
            });
        } else {
            res.status(500).json({ message: "An error occurred while saving the contact." });
        }
    } catch (error) {
        console.error("Error saving contact:", error);
        res.status(500).json({ message: "An error occurred while saving the contact." });
    }
};


exports.ResultList = catchAsync(async (req, res) => {
    try {
        const records = await resultmodel.find({});

        if (!records || records.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No  found.",
            });
        }

        res.status(200).json({
            status: true,
            data: records,
            message: "Result fetched successfully.",
        });
    } catch (error) {
        console.error("Error fetching markets:", error);
        res.status(500).json({
            status: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
});
