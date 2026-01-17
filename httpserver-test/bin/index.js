#! /usr/bin/env node
"use strict";

const http = require("http");
const router = require("../lib/core/router");

const server = http.createServer(router);
server.listen(3000, "127.0.0.1");
console.log("Server is listening on http://127.0.0.1:3000");
