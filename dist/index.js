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
    function addTask(task) {
        tasks.push(new Task(task, id++));
        res.write("Added a new task.");
    }
    function removeTask(argument) {
        tasks = tasks.filter(task => task.id !== argument);
        res.write("Task deleted.");
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(myForm);
    tasksStr = "";
    if (req.method === "POST") {
        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", () => {
            let usp = new URLSearchParams(data);
            let command = usp.get("textBox").substring(0, usp.get("textBox").indexOf(' '));
            if (usp.get("textBox").indexOf(' ') === -1) {
                command = usp.get("textBox");
            }
            let argument = usp.get("textBox").substring(usp.get("textBox").indexOf(' ') + 1);
            if (command === "delete" && tasks.some(e => e.id === parseInt(argument))) {
                removeTask(parseInt(argument));
            }
            else if (command === "todo" && argument != "") {
                addTask(argument);
            }
            else if (command === "list") {
                tasks.forEach(task => tasksStr += task.id + ": " + task.desc + "<br>");
                res.write(tasksStr);
                res.end();
            }
        });
    }
    else if (req.url !== '/favicon.ico') {
        res.end();
    }
    else {
        res.end();
    }
}).listen(3000);
