const mongoose = require("mongoose");

const panna = mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    marketId: {
        type: String,
    },
    status: {
        type: Boolean,
        required: true,
    },
    digit: {
        type: Number,
        required: true,
    },
    userId: String,
    point: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Panna", panna);
