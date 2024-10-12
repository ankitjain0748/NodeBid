const mongoose = require("mongoose");

const gamerateschema = mongoose.Schema({

    single_digit_rate: Number,
    doble_digit_rate: Number,
    Single_panna_rate: Number,
    Doble_panna_rate: Number,
    Triple_panna_rate: Number,
    full_sangam: Number,
    Half_sangam: Number,
    Digit_on: Number,
    dp_motors: Number,
    create_date: {
        type: Date,
        default: Date.now,
    },
})



module.exports = mongoose.model("Rate", gamerateschema)

