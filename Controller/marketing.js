const marketing = require("../Models/Marketing");
const catchAsync = require("../utils/catchAsync");

exports.MarketingAdd = catchAsync(async (req, res, next) => {
    try {
        const { market_status, open_time, close_time, name, market_type, result } = req.body;

        // Required fields validation
        if (!open_time || !close_time || !name) {
            return res.status(400).json({ 
                status: false,
                message: "Open time, close time, and name are required!" 
            });
        }

        // Create and save new marketing record
        const record = new marketing({
            market_status, open_time, close_time, name, market_type, result
        });

        await record.save();

        // Send success response
        res.status(201).json({
            status: true,
            data: record,
            message: "Market record added successfully.",
        });
    } catch (error) {
        console.error("Error adding market record:", error);
        res.status(500).json({
            status: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
});


exports.MarketList = catchAsync(async (req, res) => {
    try {
        const records = await marketing.find({});

        // Check if records exist
        if (!records || records.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No markets found.",
            });
        }

        res.status(200).json({
            status: true,
            data: records,
            message: "Markets fetched successfully.",
        });
    } catch (error) {
        console.error("Error fetching markets:", error);
        res.status(500).json({
            status: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
});


exports.MarketDelete = catchAsync(async (req, res, next) => {
    try {
        const { Id } = req.body;

        // Check if Id exists in the request
        if (!Id) {
            return res.status(400).json({
                status: false,
                message: "Market ID is required.",
            });
        }

        // Find and delete the record by ID
        const record = await marketing.findOneAndDelete({ _id: Id });

        // Check if the record was found and deleted
        if (!record) {
            return res.status(404).json({
                status: false,
                message: "Market not found.",
            });
        }

        // Successfully deleted
        res.status(200).json({
            status: true,
            data: record,
            message: "Market deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting market record:", error);
        res.status(500).json({
            status: false,
            message: "Internal Server Error. Please try again later.",
        });
    }
});


exports.MarketUpdate = catchAsync(async (req, res, next) => {
    try {
        const { Id, market_status, open_time, close_time, name, market_type, result } = req.body;

        // Check if Id exists in the request
        if (!Id) {
            return res.status(400).json({
                status: false,
                message: "Market ID is required.",
            });
        }

        // Validate required fields for updating
        if (!open_time || !close_time || !name) {
            return res.status(400).json({
                status: false,
                message: "Open time, close time, and name are required to update the market!",
            });
        }

        // Find the market by ID and update its fields
        const updatedRecord = await marketing.findByIdAndUpdate(
            Id,
            { market_status, open_time, close_time, name, market_type, result },
            { new: true, runValidators: true }
        );

        // Check if the record exists
        if (!updatedRecord) {
            return res.status(404).json({
                status: false,
                message: "Market not found!",
            });
        }

        // Successfully updated
        res.status(200).json({
            status: true,
            data: updatedRecord,
            message: "Market updated successfully.",
        });
    } catch (error) {
        console.error("Error updating market record:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while updating the market. Please try again later.",
        });
    }
});
