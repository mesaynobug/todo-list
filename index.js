"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
let tasks = [];
let tasksStr = "";
let myForm = `<form action="" method="post">
                      <input type="text" id="textBox" name=textBox autofocus="autofocus">
                      <button type="submit">Hello!</button>
                      </form>`;
(0, http_1.createServer)(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(myForm);
    tasksStr = "";
    if (req.method == "POST") {
        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", () => {
            let usp = new URLSearchParams(data);
            if (usp.get("textBox") != "") {
                tasks.push(usp.get("textBox"));
            }
            for (let element in tasks) {
                tasksStr += tasks[element] + "<br>";
            }
            res.write(tasksStr);
            res.end();
        });
    }
    else {
        for (let element in tasks) {
            tasksStr += tasks[element] + "<br>";
        }
        res.write(tasksStr);
        res.end();
    }
}).listen(3000);
