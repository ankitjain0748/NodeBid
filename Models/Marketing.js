const mongoose = require('mongoose');

const marketingSchema = new mongoose.Schema({
  market_status: {
    type: String,
    required: true,
  },
  open_time: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Regex to match time format HH:MM (24-hour format)
        return /^([01]\d|2[0-3]):?([0-5]\d)$/.test(v);
      },
      message: props => `${props.value} is not a valid time format!`
    },
  },
  close_time: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Regex to match time format HH:MM (24-hour format)
        return /^([01]\d|2[0-3]):?([0-5]\d)$/.test(v);
      },
      message: props => `${props.value} is not a valid time format!`
    },
  },
  name: {
    type: String,
    required: true,
  },
  market_type: {
    type: String,
    required: true,
  },
  result: {
    type: Number,
  }
});

const Marketing = mongoose.model('marketing', marketingSchema);

module.exports = Marketing;
