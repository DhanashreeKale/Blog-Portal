"use strict";
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
const blog_structure_1 = require("../models/blog_structure");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authorize = require("../middleware/auth");
const adminAuthorization = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
//Getting the list of blogs
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_structure_1.Blog.find();
    res.status(200).send(blog);
})); //get ends here
//Getting a particular blog with its ID
router.get("/:id", validateObjectId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_structure_1.Blog.findById(req.params.id);
    if (!blog)
        return res.status(404).send("The requested blog could not be found");
    res.send(blog);
})); //get by ID ends here
//adding a new blog and saving it into the database
router.post("/", authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, blog_structure_1.validateBlog)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    let blog = new blog_structure_1.Blog({
        blog_title: req.body.blog_title,
        blog_author: req.body.blog_author,
        blog_content: req.body.blog_content,
    });
    blog = yield blog.save();
    res.status(201).send(blog);
})); //Post method ends here
//publishing a particular blog on the website on authorization of admin
router.patch("/", [authorize, adminAuthorization], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_structure_1.Blog.findOne({
        _id: req.body.blogId,
        isPublished: false,
    });
    if (!blog)
        return res.status(404).send("Blog not found..");
    blog.isPublished = true;
    yield blog.save();
    res.status(200).send(blog);
})); //Patch method ends here
//update a particular blog(excluding comments) by its ID
router.put("/:id", [authorize, validateObjectId], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, blog_structure_1.validateBlog)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const blog = yield blog_structure_1.Blog.findByIdAndUpdate(req.params.id, {
        blog_title: req.body.blog_title,
        blog_author: req.body.blog_author,
        blog_content: req.body.blog_content,
    }, { new: true });
    if (!blog)
        return res.status(404).send("Blog not found..");
    res.status(200).send(blog);
})); //Put method ends here
//Deleting a particular blog by its ID
router.delete("/:id", [authorize, adminAuthorization, validateObjectId], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_structure_1.Blog.findByIdAndRemove(req.params.id);
    if (!blog)
        return res.status(404).send("Blog not found");
    res.status(200).send(blog);
})); //delete blog method ends here
//adding a comment on a particular blog(using its ID)
router.post("/comment", authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let d = new Date();
    const blog = yield blog_structure_1.Blog.findOne({ _id: req.body.blogId });
    if (!blog)
        return res.status(404).send("Blog not found..");
    if (req.body.comment_content.length < 2 ||
        req.body.comment_content.length > 30)
        return res
            .status(400)
            .send("Comment cannot be less than 2 and more than 30 characters");
    blog.blog_comments.push({
        time_posted: d,
        comment_content: req.body.comment_content,
    });
    yield blog.save();
    res.status(200).send("Comment added successfully");
})); //Post method ends here
//Deleting a particular comment on a particular blog(use blogId and commentId)
router.delete("/:id/comment", [authorize, adminAuthorization], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_structure_1.Blog.updateOne({ _id: req.params.id }, { $pull: { blog_comments: { _id: { $eq: req.body.commentId } } } });
    if (!blog)
        return res.status(404).send("Not found");
    res.status(200).send(blog);
})); //delete comment method ends here
module.exports = router;
