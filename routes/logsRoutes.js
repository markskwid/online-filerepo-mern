const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
let router = express.Router();
var cors = require("cors");
const LogModel = require("../models/logsSchema");

router.route("/read-logs").get((req, res, next) => {
  LogModel.find((error, data) => {
    if (error) {
      console.log("error fetching data");
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

module.exports = router;
