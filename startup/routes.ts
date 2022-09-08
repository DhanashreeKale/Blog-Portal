import express from "express";
const blog = require("../routes/blog_routes");
const error = require("../middleware/error");
const users = require("../routes/users");
const auth = require("../routes/auth"); //authentication

module.exports = function (app: any) {
  //Express Middleware
  app.use(express.json());
  app.use("/blogs", blog);
  app.use("/users", users);
  app.use("/auth", auth);
  app.use(error);
};
