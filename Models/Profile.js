const mongoose = require("mongoose")


const profileschema = mongoose.Schema({

    Profile_name: String,
    Upi_id: String,
    whatapps: Number,
    phone: Number,
    profile_email: String,
    marchant_id: String,
    min_widthrawal_rate: Number,
    min_desposite_rate: Number,
    min_bid_amount: Number,
    welcome_bouns: Number,
    Withrawal: String,
    App_link: String,
    message: String,
    Video_link: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Signup'  // Reference to the User model
    },
    create_date: {
        type: Date,
        default: Date.now,
    },
})
module.exports = mongoose.model("profile", profileschema);
