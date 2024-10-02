const mongoose  = require("mongoose")


const schema= mongoose.Schema({
    transcation_id: {
        type: String,
        required: true,
      },
      user_id: {
        type: String,
      },
      amount: {
        type: String,
        required: true,
      },

})

module.exports = mongoose.model("success_payment", schema);
