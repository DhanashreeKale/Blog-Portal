"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlog = exports.Blog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Joi = require("joi");
exports.Blog = mongoose_1.default.model("Blog", new mongoose_1.default.Schema({
    blog_title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
    },
    blog_author: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    blog_content: {
        type: String,
        required: true,
        minlength: 50,
        maxlength: 650,
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false,
    },
    blog_comments: [
        {
            time_posted: {
                type: String,
            },
            comment_content: {
                type: String,
            },
        },
    ],
}));
function validateBlog(blog) {
    const schema = {
        blog_title: Joi.string().min(5).max(100).required(),
        blog_author: Joi.string().min(5).max(50).required(),
        blog_content: Joi.string().min(50).max(650).required(),
    };
    return Joi.validate(blog, schema);
}
exports.validateBlog = validateBlog;
