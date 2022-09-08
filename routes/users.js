"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const authorize = require("../middleware/auth");
const { User, validateUser } = require("../models/user_structure");
const router = express_1.default.Router();
//getting the currently logged in user.
router.get("/me", authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findById(req.user._id).select("-user_password");
    res.send(user);
}));
//register a user and hash its password
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = validateUser(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let user = yield User.findOne({ user_email: req.body.user_email }); //find the user with the given email
    if (user)
        return res.status(400).send("User already registered.");
    user = new User({
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_password: req.body.user_password,
    });
    const salt = yield bcrypt.genSalt(10);
    user.user_password = yield bcrypt.hash(user.user_password, salt); //salt is included in the hashed password. while decoding the original salt is needed.
    yield user.save();
    //generate a jwt token to send this to the http header to keep the user logged in.
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send({
        _id: user._id,
        user_name: user.user_name,
        user_email: user.user_email,
    });
}));
module.exports = router;
