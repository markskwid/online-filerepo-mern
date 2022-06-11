const mongoose = require("mongoose");

const LogsSchema = new mongoose.Schema({
  uid: String,
  username: String,
  action: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Logs = mongoose.model("Logs", LogsSchema, "Logs");

module.exports = Logs;
