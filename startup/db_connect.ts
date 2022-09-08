import mongoose from "mongoose";
const winston = require("winston");
const config = require("config");

module.exports = function () {
  //Connecting to MongoDB
  const db = config.get("db");
  mongoose.connect(db).then(() => {
    winston.info(`Connected to MongoDB ${db}`);
  });
};
