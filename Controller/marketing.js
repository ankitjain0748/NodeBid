const marketing = require("../Models/Marketing")

const catchAsync = require("../utils/catchAsync")

exports.MarketingAdd = catchAsync(async (req, res, next) => {
    const { market_status, open_time, close_time, name, market_type,result } = req.body;
    // if (!market_status || !open_time || !close_time || !name || !market_type) {
    //     return res.status(400).json({ message: "All fields are required!" });
    // }
    const record = new marketing({
        market_status, open_time, close_time, name, market_type,result
    });

    await record.save();

    res.status(201).json({
        data: record,
        status:true,
        message: "Market record added successfully.",
    });
});



exports.MarketList = catchAsync(async (req, res) => {
    const records = await marketing.find({});
    res.json({
        data: records,
        status: 200,
    });
});


exports.MarketDelete = async (req, res) => {
    try {
        const { Id } = req.body;
        
        // Check if Id exists
        if (!Id) {
            return res.status(400).json({
                message: "Market ID is required",
                status: 400,
            });
        }

        // Find and delete the record
        const record = await marketing.findOneAndDelete({ _id: Id });

        // Check if the record exists
        if (!record) {
            return res.status(404).json({
                message: "Market not found",
                status: 404,
            });
        }

        // Successfully deleted
        res.json({
            message: "Market deleted successfully",
            data: record,
            status: 200,
        });
    } catch (error) {
        // Log the error and send the response
        console.error("Error in MarketDelete:", error);
        res.status(500).json({
            message: "An error occurred while deleting the market",
            error: error.message,
            status: 500,
        });
    }
};
