const mongoose = require("mongoose");
const FileSchema = new mongoose.Schema({
  fileName: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  extensionName: String,
  belongsTo: String,
});

const File = mongoose.model("Files", FileSchema, "Files");

module.exports = File;
