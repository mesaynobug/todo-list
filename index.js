"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
class Task {
    constructor(desc, id) {
        this.desc = desc;
        this.id = id;
    }
}
let tasks = [];
let id = 1;
let tasksStr = "";
let myForm = `<form action="" method="post">
                      <input type="text" id="textBox" name=textBox autofocus="autofocus">
                      <button type="submit">Hello!</button>
                      </form>`;
(0, http_1.createServer)(function (req, res) {
    function writeTasks() {
        for (let element in tasks) {
            tasksStr += tasks[element].id + ": " + tasks[element].desc + "<br>";
        }
        res.write(tasksStr);
        res.end();
    }
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
                tasks.push(new Task(usp.get("textBox"), id++));
            }
            writeTasks();
        });
    }
    else if (req.url === '/favicon.ico') {
        res.end();
    }
    else {
        writeTasks();
    }
}).listen(3000);
