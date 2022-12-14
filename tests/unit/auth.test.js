"use strict";
const { User } = require("../../models/user_structure");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
describe("Generate Auth Token", () => {
    it("should return a valid JWT", () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true,
        };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        expect(decoded).toMatchObject(payload);
    });
});
