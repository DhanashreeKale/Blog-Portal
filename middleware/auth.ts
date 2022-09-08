import * as jwt from "jsonwebtoken";
import config = require("config");

//middleware function to get the jwt function from the http header
module.exports = function (req: any, res: any, next: any) {
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).send("Access denied. No token provided.");

  //When there is a token, we need to verify the validity of the token
  try {
    //token and a private key for decoding this token.
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next(); //sending control to the next middleware function
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
