"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
(0, http_1.createServer)(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(`<form action="" method="post">
            <input type="text" id="textBox" name=textBox>
            <button>Hello!</button>
            </form>`);
    if (req.method == "POST") {
        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", () => {
            let usp = new URLSearchParams(data);
            console.log(usp.get("textBox"));
        });
    }
    res.end();
}).listen(3000);
