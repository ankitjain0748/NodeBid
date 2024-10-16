const mongoose = require("mongoose")


const resultmongoose = mongoose.Schema({

    betdate:{
        type: Date,
    },

    session :{
        type :String
    },

    number :{
        type :Number
    },

    market_id :{
        type :String 
    },


})


const resultmodel = mongoose.model("result" , resultmongoose);


module.exports= resultmodel;