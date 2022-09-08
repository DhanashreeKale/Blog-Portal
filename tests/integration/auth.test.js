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
const { User } = require("../../models/user_structure");
const { Blog } = require("../../models/blog_structure");
describe("authorization middleware", () => {
    beforeEach(() => {
        server = require("../../server");
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield server.close();
        yield Blog.remove({});
    }));
    let token;
    const execute = () => {
        return request(server)
            .post("/blogs/add-blog")
            .set("x-auth-token", token)
            .send({
            blog_title: "Java Course",
            blog_author: "James Gosling",
            blog_content: "Hello Java test. I am James Gosling. The father of Java programming language. It is an object oriented programming language",
        });
    };
    beforeEach(() => {
        token = new User().generateAuthToken();
    });
    it("should return 401 if no token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        token = "";
        const res = yield execute();
        expect(res.status).toBe(401);
    }));
    it("should return 400 if token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        token = "a";
        const res = yield execute();
        expect(res.status).toBe(400);
    }));
    it("should return 200 if token is valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield execute();
        expect(res.status).toBe(201);
    }));
});
