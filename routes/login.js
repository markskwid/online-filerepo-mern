const express = require("express");
const mongoose = require("mongoose");
//const LoginModel = require("../models/loginSchema.js");
const UserModel = require("../models/userSchema");
const app = express();
let router = express.Router();

router.route("/login").post((req, res, next) => {
  const { username, password } = req.body;
  UserModel.findOne({ username: username }, (err, user) => {
    if (user) {
      if (password === user.password) {
        if (user.verified) {
          res.send({ user: user });
        } else {
          res.send({ notVerified: true });
        }
      } else {
        res.send({ wrongPass: true });
      }
    } else {
      res.send({ notExists: true });
    }
  });
});

module.exports = router;
