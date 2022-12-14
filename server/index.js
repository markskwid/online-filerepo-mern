const { create } = require("domain");
require("dotenv").config();
const express = require("express");
const router = require("express").Router();
const fileRouter = require("../routes/fileRoutes");
const Login = require("../routes/login");
const User = require("../routes/userRoutes");
const Logs = require("../routes/logsRoutes");
const path = require("path");
const connection = require("../database/connection.js");
const publicPath = path.join(__dirname, "..", "public");
var fs = require("fs");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use("/api", fileRouter);
app.use("/manage-user", User);
app.use("/logs", Logs);

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, "../client/build")));

// Handle GET requests to /api route
app.get("/apis", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.post("/download", (req, res, next) => {
  const { body } = req;
  const file = body.fileName;
  res.download(`./client/src/${file}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
