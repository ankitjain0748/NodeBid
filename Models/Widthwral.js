const mongoose  = require("mongoose")


const paymentschema= mongoose.Schema({
    upi_id: {
        type: String,
      },
      user_id: {
        type: String,
      },
      amount: {
        type: Number,
        required: true,
      },
      transcation_id: {
        type: String,
      }

})

module.exports = mongoose.model("payment", paymentschema);
