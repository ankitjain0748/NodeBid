const mongoose = require("mongoose");

const MarketingSchema = mongoose.Schema({
    market_status: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    market_type: {
        type: String,
        required: true,
    },
    open_time: { type: Date, default: Date.now() },
    close_time: { type: Date, default: Date.now() },

});

module.exports = mongoose.model("marketing", MarketingSchema);
