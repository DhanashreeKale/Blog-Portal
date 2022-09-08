"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const config = require("config");
const winston = require("winston");
const app = (0, express_1.default)();
//Routes
require("./startup/routes")(app);
//Database connection
require("./startup/db_connect")();
process.on("uncaughtException", (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
});
process.on("unhandledRejection", (ex) => {
    winston.error(ex.message, ex);
    process.exit(1);
});
//loggin errors on winston
winston.add(winston.transports.File, { filename: "logfile.log" });
//if jwt private key is not defined, throw an error and stop the further process
console.log(config.get("jwtPrivateKey"));
if (!config.get("jwtPrivateKey")) {
    console.error("ERROR: jwtPrivateKey is not defined");
    process.exit(1);
}
//Server Port
const server = app.listen(3000, () => {
    console.log(`Application running on port 3000`);
});
module.exports = server;
