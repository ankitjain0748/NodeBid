const mongoose = require("mongoose");

const signupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mpin: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  phone_digit: {
    type: Number,
  },
  role: {
    type: String,
    enum: ["user", "admin", "subadmin"],
    default: "user",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Signup", signupSchema);
