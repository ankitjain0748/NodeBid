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

    marketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'marketing'  // Reference to the User model
    },

})


const resultmodel = mongoose.model("result" , resultmongoose);


module.exports= resultmodel;