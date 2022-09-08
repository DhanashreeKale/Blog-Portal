"use strict";
const winston = require("winston");
//this below function is particular to express only
module.exports = function (err, req, res, next) {
    //Log the exceptions
    winston.error(err.message, err);
    res.status(500).send("Something Failed");
};
/*
when we use async and await, we deal with promises and
these promises need to be handled.

It is not feasible to mention a try catch block on every
route. Hence this middleware function defined above will
handle the unhandled promised.
*/
