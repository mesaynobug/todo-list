"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
(0, http_1.createServer)(function (req, res) {
    res.write('Hello World');
    res.end();
}).listen(3000);
