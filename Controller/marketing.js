const marketing = require("../Models/Marketing")
const catchAsync = require("../utils/catchAsync")

exports.MarketingAdd = catchAsync(async (req, res, next) => {
    const {  market_status, open_time, close_time, name, market_type } = req.body;
    if (  !market_status  || !open_time || !close_time || !name || !market_type) {
        return res.status(400).json({ message: "All fields are required!" });
    }
    const record = new marketing({
         market_status, open_time, close_time, name, market_type
    });

    await record.save();

    res.status(201).json({
        data: record,
        message: "Market record added successfully.",
    });
});


exports.marketlist = catchAsync(async (req, res) => {
    const records = await marketing.find({});
    res.json({
        data: records,
        status: 200,
    });
});
