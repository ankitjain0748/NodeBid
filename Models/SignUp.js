const mongoose = require("mongoose");

const signupSchema = mongoose.Schema({
  mpin: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
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
  amount: {
    type: Number,
    default: 0
  },
  user_status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

module.exports = mongoose.model("Signup", signupSchema);
