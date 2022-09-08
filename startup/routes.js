"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog = require("../routes/blog_routes");
const error = require("../middleware/error");
const users = require("../routes/users");
const auth = require("../routes/auth"); //authentication
module.exports = function (app) {
    //Express Middleware
    app.use(express_1.default.json());
    app.use("/blogs", blog);
    app.use("/users", users);
    app.use("/auth", auth);
    app.use(error);
};
