"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const userSchema = new mongoose_1.default.Schema({
    user_name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    user_email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
    },
    user_password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"));
    if (!token)
        return "Token not generted";
    return token;
};
const User = mongoose_1.default.model("User", userSchema);
function validateUser(user) {
    const schema = {
        user_name: Joi.string().min(5).max(50).required(),
        user_email: Joi.string().min(5).max(255).email().required(),
        user_password: Joi.string().min(5).max(100).required(),
    };
    return Joi.validate(user, schema);
}
exports.validateUser = validateUser;
exports.User = User;
