const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: String,
  username: String,
  email: String,
  verified: {
    type: Boolean,
    default: false,
  },
  role: String,
  password: String,
  area: String,
  picture: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("Users", UserSchema, "Users");

module.exports = User;
