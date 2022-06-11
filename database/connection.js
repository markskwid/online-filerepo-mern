const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const url =
  "mongodb+srv://skwiddyboi:markfranciscobacsal@cluster0.bbwug.mongodb.net/myDatabase?retryWrites=true&w=majority";

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });
