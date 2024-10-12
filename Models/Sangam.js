const mongoose = require("mongoose");

const sangamschema = mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    marketId: {
        type: String,
    },
    open_panna: {
        type: Number,
        required: true,
    },
    open_panna_sum: {
        type: Number,
    },
    userId: String,
    close_panna: {
        type: Number,
        required: true,
    },
    bid_point: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Sangam", sangamschema);
