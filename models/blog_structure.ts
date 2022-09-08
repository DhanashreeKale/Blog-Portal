import mongoose from "mongoose";
const Joi = require("joi");

export const Blog = mongoose.model(
  "Blog",
  new mongoose.Schema({
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
  })
);

export function validateBlog(blog: any) {
  const schema = {
    blog_title: Joi.string().min(5).max(100).required(),
    blog_author: Joi.string().min(5).max(50).required(),
    blog_content: Joi.string().min(50).max(650).required(),
  };
  return Joi.validate(blog, schema);
}
