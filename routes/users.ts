import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import config = require("config");
import express from "express";
const authorize = require("../middleware/auth");
const { User, validateUser } = require("../models/user_structure");
const router = express.Router();

//getting the currently logged in user.
router.get("/me", authorize, async (req: any, res: any) => {
  const user = await User.findById(req.user._id).select("-user_password");
  res.send(user);
});

//register a user and hash its password
router.post("/register", async (req: any, res: any) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ user_email: req.body.user_email }); //find the user with the given email
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_password: req.body.user_password,
  });

  const salt = await bcrypt.genSalt(10);
  user.user_password = await bcrypt.hash(user.user_password, salt); //salt is included in the hashed password. while decoding the original salt is needed.
  await user.save();

  //generate a jwt token to send this to the http header to keep the user logged in.
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    _id: user._id,
    user_name: user.user_name,
    user_email: user.user_email,
  });
});

module.exports = router;
