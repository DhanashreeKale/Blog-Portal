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
Object.defineProperty(exports, "__esModule", { value: true });
let server;
const request = require("supertest");
const { Blog } = require("../../models/blog_structure");
const { User } = require("../../models/user_structure");
const mongoose = require("mongoose");
describe("/blogs", () => {
    beforeEach(() => {
        server = require("../../server");
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield server.close();
        //await Blog.remove({});
    }));
    describe("GET /", () => {
        it("should return all blogs", () => __awaiter(void 0, void 0, void 0, function* () {
            yield Blog.collection.insert({
                blog_title: "Java Course",
                blog_author: "James Gosling",
                blog_content: "Hello Java test. I hope this is a success",
            });
            const res = yield request(server).get("/blogs/view-blogs");
            expect(res.status).toBe(200);
            expect(Blog).toHaveLength(3);
        }));
    });
    describe("GET /:id", () => {
        it("should return a blog if valid blog id is passed", () => __awaiter(void 0, void 0, void 0, function* () {
            const blog = new Blog({
                blog_title: "Java Course",
                blog_author: "James Gosling",
                blog_content: "Hello Java test. I am James Gosling. The father of Java programming language. It is an object oriented programming language",
            });
            yield blog.save();
            const res = yield request(server).get("/blogs/view-blog/" + blog._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("blog_title", blog.blog_title);
            expect(res.body).toHaveProperty("blog_author", blog.blog_author);
            expect(res.body).toHaveProperty("blog_content", blog.blog_content);
        }));
        it("should return 404 if invalid blog id is passed", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield request(server).get("/blogs/view-blog/1");
            expect(res.status).toBe(404);
        }));
    });
    describe("POST /", () => {
        let token;
        const execute = () => __awaiter(void 0, void 0, void 0, function* () {
            return yield request(server)
                .post("/blogs/add-blog")
                .set("x-auth-token", token)
                .send({
                blog_title: "Java Course",
                blog_author: "James Gosling",
                blog_content: "Hello Java test. I am James Gosling. The father of Java programming language. It is an object oriented programming language",
            });
        });
        beforeEach(() => {
            token = new User().generateAuthToken();
        });
        it("should return 401 if client is not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            token = "";
            const res = yield execute();
            expect(res.status).toBe(401);
        }));
        it("should save the blog if it is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            //TODO:
            yield execute();
            const blog = yield Blog.find({ blog_title: "Java Course" });
            expect(blog).not.toBeNull();
        }));
        it("should return the blog if it is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield execute();
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("blog_title");
            expect(res.body).toHaveProperty("blog_author");
            expect(res.body).toHaveProperty("blog_content");
        }));
    });
    describe("PUT /:id", () => {
        let token;
        let newBlogTitle, newBlogAuthor, newBlogContent;
        let blog;
        let _id;
        const execute = () => __awaiter(void 0, void 0, void 0, function* () {
            return yield request(server)
                .put("/blogs/update-blog/" + _id)
                .set("x-auth-token", token)
                .send({
                blog_title: newBlogTitle,
                blog_author: newBlogAuthor,
                blog_content: newBlogContent,
            });
        });
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            blog = new Blog({
                blog_title: "Java Course",
                blog_author: "James Gosling",
                blog_content: "Hello Java test. I am James Gosling. The father of Java programming language. It is an object oriented programming language",
            });
            yield blog.save();
            token = new User().generateAuthToken();
            _id = blog._id;
            newBlogTitle = "Introduction to MERN Stack";
            newBlogAuthor = "Maximilian Schwarzmüller";
            newBlogContent =
                "MERN Stack is a Javascript Stack that is used for easier and faster deployment of full-stack web applications. MERN Stack comprises of 4 technologies namely: MongoDB, Express, React and Node.js. It is designed to make the development process smoother and easier.";
        }));
        it("should return 401 if client is not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            token = "";
            const res = yield execute();
            expect(res.status).toBe(401);
        }));
        it("should return 404 if id is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            _id = new mongoose.Types.ObjectId().toHexString();
            const res = yield execute();
            expect(res.status).toBe(404);
        }));
        it("should return 404 if blog with the given id was not found", () => __awaiter(void 0, void 0, void 0, function* () {
            _id = new mongoose.Types.ObjectId().toHexString();
            const res = yield execute();
            expect(res.status).toBe(404);
        }));
        it("should update the blog if input is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield execute();
            const updatedBlog = yield Blog.findById(blog._id);
            expect(updatedBlog.blog_title).toBe(newBlogTitle);
            expect(updatedBlog.blog_author).toBe(newBlogAuthor);
            expect(updatedBlog.blog_content).toBe(newBlogContent);
        }));
        it("should return the updated blog if it is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield execute();
            expect(res.body).toHaveProperty("blog_title", newBlogTitle);
            expect(res.body).toHaveProperty("blog_author", newBlogAuthor);
            expect(res.body).toHaveProperty("blog_content", newBlogContent);
        }));
    });
    describe("DELETE /:id", () => {
        let token;
        let blog;
        let id;
        const execute = () => __awaiter(void 0, void 0, void 0, function* () {
            return yield request(server)
                .delete("/blogs/delete-blog/" + id)
                .set("x-auth-token", token)
                .send();
        });
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // Before each test we need to create a blog and put it in the database.
            blog = new Blog({
                blog_title: "Java Course",
                blog_author: "James Gosling",
                blog_content: "Hello Java test. I am James Gosling. The father of Java programming language. It is an object oriented programming language",
            });
            yield blog.save();
            id = blog._id;
            token = new User({ isAdmin: true }).generateAuthToken();
        }));
        it("should return 401 if client is not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            token = "";
            const res = yield execute();
            expect(res.status).toBe(401);
        }));
        it("should return 403 if the user is not an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            token = new User({ isAdmin: false }).generateAuthToken();
            const res = yield execute();
            expect(res.status).toBe(403);
        }));
        it("should return 404 if id is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            id = 1;
            const res = yield execute();
            expect(res.status).toBe(404);
        }));
        it("should return 404 if no blog with the given id was found", () => __awaiter(void 0, void 0, void 0, function* () {
            id = mongoose.Types.ObjectId();
            const res = yield execute();
            expect(res.status).toBe(404);
        }));
        it("should delete the blog if input is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            yield execute();
            const blogInDb = yield Blog.findById(id);
            expect(blogInDb).toBeNull();
        }));
        it("should return the removed blog", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield execute();
            expect(res.body).toHaveProperty("_id", blog._id.toHexString());
            expect(res.body).toHaveProperty("blog_title", blog.blog_title);
            expect(res.body).toHaveProperty("blog_author", blog.blog_author);
            expect(res.body).toHaveProperty("blog_content", blog.blog_content);
        }));
    });
    describe("POST Comment/", () => {
        let token;
        let _id;
        const execute = () => __awaiter(void 0, void 0, void 0, function* () {
            return yield request(server)
                .post("/blogs/add-comment")
                .set("x-auth-token", token)
                .send({
                blogId: _id,
            });
        });
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            const blog = new Blog({
                blog_title: "Java Course",
                blog_author: "James Gosling",
                blog_content: "Hello Java test. I am James Gosling. The father of Java programming language. It is an object oriented programming language",
            });
            yield blog.save();
            _id = blog._id;
            token = new User().generateAuthToken();
        }));
        it("should return 401 if client is not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            token = "";
            const res = yield execute();
            expect(res.status).toBe(401);
        }));
        it("should return 404 if invalid blog id is passed", () => __awaiter(void 0, void 0, void 0, function* () {
            _id = new mongoose.Types.ObjectId().toHexString();
            const res = yield execute();
            expect(res.status).toBe(404);
        }));
        it("should return 200 if valid blog id is passed and comment is added", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield execute();
            expect(res.status).toBe(200);
        }));
    });
    describe("DELETE Comment", () => {
        let token;
        let blog;
        let blogId;
        let commentId;
        const execute = () => __awaiter(void 0, void 0, void 0, function* () {
            return yield request(server)
                .delete("/blogs/delete-comment/")
                .set("x-auth-token", token)
                .send({
                blogId: blogId,
                commentId: commentId,
            });
        });
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // Before each test we need to create a blog and put it in the database.
            blog = new Blog({
                blog_title: "Java Course",
                blog_author: "James Gosling",
                blog_content: "Hello Java test. I am James Gosling. The father of Java programming language. It is an object oriented programming language",
                blog_comments: [{ comment_content: "Nice" }],
            });
            yield blog.save();
            blogId = blog._id;
            commentId = blog.blog_comments[0]._id;
            token = new User({ isAdmin: true }).generateAuthToken();
        }));
        it("should return 401 if client is not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            token = "";
            const res = yield execute();
            expect(res.status).toBe(401);
        }));
        it("should return 403 if the user is not an admin", () => __awaiter(void 0, void 0, void 0, function* () {
            token = new User({ isAdmin: false }).generateAuthToken();
            const res = yield execute();
            expect(res.status).toBe(403);
        }));
        it("should return 200 if blog id and comment id is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            blogId = mongoose.Types.ObjectId();
            commentId = mongoose.Types.ObjectId();
            const res = yield execute();
            expect(res.status).toBe(200);
        }));
        it("should delete the comment if input is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield execute();
            expect(res._body.modifiedCount).toBe(1); //this means deletions has actually been done
            expect(res.status).toBe(200);
        }));
    });
});
