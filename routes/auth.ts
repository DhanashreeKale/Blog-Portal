import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import config = require("config");
const { User } = require("../models/user_structure");
import express from "express";
const router = express.Router();

//API for authentication check if the user is registerd
router.post("/user", async (req, res) => {
  let user = await User.findOne({ user_email: req.body.user_email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(
    req.body.user_password,
    user.user_password
  );
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  //  User login is a success here. Hence generate a JWT
  const token = user.generateAuthToken();
  res.send(token); //res.send("Successfull Login")
});

module.exports = router;
