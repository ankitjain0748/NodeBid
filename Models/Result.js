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

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Signup'  // Reference to the User model
    },
    panaaModal : {
        type: Array,
    },

    sangamModal : {
        type: Array,
    }

})


const resultmodel = mongoose.model("result" , resultmongoose);


module.exports= resultmodel;