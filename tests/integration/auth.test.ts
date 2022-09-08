export {};
let server: any;
const request = require("supertest");
const { User } = require("../../models/user_structure");
const { Blog } = require("../../models/blog_structure");

describe("authorization middleware", () => {
  beforeEach(() => {
    server = require("../../server");
  });
  afterEach(async () => {
    await server.close();
    await Blog.remove({});
  });

  let token: any;
  const execute = () => {
    return request(server)
      .post("/blogs/add-blog")
      .set("x-auth-token", token)
      .send({
        blog_title: "Java Course",
        blog_author: "James Gosling",
        blog_content:
          "Hello Java test. I am James Gosling. The father of Java programming language. It is an object oriented programming language",
      });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await execute();
    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await execute();
    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await execute();
    expect(res.status).toBe(201);
  });
});
