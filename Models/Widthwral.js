const mongoose  = require("mongoose")


const schema= mongoose.Schema({
    upi_id: {
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

module.exports = mongoose.model("widthrwal_payment", schema);
