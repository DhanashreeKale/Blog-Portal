import { Blog, validateBlog } from "../models/blog_structure";
import express from "express";
const router = express.Router();
const authorize = require("../middleware/auth");
const adminAuthorization = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

//Getting the list of blogs
router.get("/", async (req, res) => {
  const blog = await Blog.find();
  res.status(200).send(blog);
}); //get ends here

//Getting a particular blog with its ID
router.get("/:id", validateObjectId, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog)
    return res.status(404).send("The requested blog could not be found");
  res.send(blog);
}); //get by ID ends here

//adding a new blog and saving it into the database
router.post("/", authorize, async (req, res) => {
  const { error } = validateBlog(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let blog = new Blog({
    blog_title: req.body.blog_title,
    blog_author: req.body.blog_author,
    blog_content: req.body.blog_content,
  });
  blog = await blog.save();
  res.status(201).send(blog);
}); //Post method ends here

//publishing a particular blog on the website on authorization of admin
router.patch(
  "/",
  [authorize, adminAuthorization],
  async (req: any, res: any) => {
    const blog = await Blog.findOne({
      _id: req.body.blogId,
      isPublished: false,
    });
    if (!blog) return res.status(404).send("Blog not found..");

    blog.isPublished = true;

    await blog.save();
    res.status(200).send(blog);
  }
); //Patch method ends here

//update a particular blog(excluding comments) by its ID
router.put(
  "/:id",
  [authorize, validateObjectId],
  async (req: any, res: any) => {
    const { error } = validateBlog(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        blog_title: req.body.blog_title,
        blog_author: req.body.blog_author,
        blog_content: req.body.blog_content,
      },
      { new: true }
    );

    if (!blog) return res.status(404).send("Blog not found..");

    res.status(200).send(blog);
  }
); //Put method ends here

//Deleting a particular blog by its ID
router.delete(
  "/:id",
  [authorize, adminAuthorization, validateObjectId],
  async (req: any, res: any) => {
    const blog = await Blog.findByIdAndRemove(req.params.id);
    if (!blog) return res.status(404).send("Blog not found");

    res.status(200).send(blog);
  }
); //delete blog method ends here

//adding a comment on a particular blog(using its ID)
router.post("/comment", authorize, async (req, res) => {
  let d: Date = new Date();

  const blog = await Blog.findOne({ _id: req.body.blogId });
  if (!blog) return res.status(404).send("Blog not found..");

  if (
    req.body.comment_content.length < 2 ||
    req.body.comment_content.length > 30
  )
    return res
      .status(400)
      .send("Comment cannot be less than 2 and more than 30 characters");

  blog.blog_comments.push({
    time_posted: d,
    comment_content: req.body.comment_content,
  });

  await blog.save();
  res.status(200).send("Comment added successfully");
}); //Post method ends here

//Deleting a particular comment on a particular blog(use blogId and commentId)
router.delete(
  "/:id/comment",
  [authorize, adminAuthorization],
  async (req: any, res: any) => {
    const blog = await Blog.updateOne(
      { _id: req.params.id },
      { $pull: { blog_comments: { _id: { $eq: req.body.commentId } } } }
    );
    if (!blog) return res.status(404).send("Not found");
    res.status(200).send(blog);
  }
); //delete comment method ends here

module.exports = router;
