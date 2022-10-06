"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
class Task {
    constructor(desc, id) {
        this.desc = desc;
        this.id = id;
        this.complete = false;
    }
}
class AddCommand {
    run(input, res) {
        tasks.push(new Task(input, id++));
        res.write("Added a new task.");
    }
}
AddCommand.COMMAND_WORD = "todo";
class RemoveCommand {
    run(input, res) {
        tasks = tasks.filter(task => task.id.toString() !== input);
        res.write("Task deleted.");
    }
}
RemoveCommand.COMMAND_WORD = "remove";
class ListCommand {
    run(input, res) {
        tasks.forEach(task => tasksStr += task.id + ": " + task.desc + "<br>");
        res.write(tasksStr);
        res.end();
    }
}
ListCommand.COMMAND_WORD = "list";
class InvalidCommand {
    run(input, res) {
        res.write("Invalid Command!");
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
            let varCommand = usp.get("textBox").substring(0, usp.get("textBox").indexOf(' '));
            if (usp.get("textBox").indexOf(' ') == -1) {
                varCommand = usp.get("textBox");
            }
            let argument = usp.get("textBox").substring(usp.get("textBox").indexOf(' ') + 1);
            let command;
            switch (varCommand.toLowerCase().trim()) {
                case AddCommand.COMMAND_WORD:
                    command = new AddCommand();
                    break;
                case RemoveCommand.COMMAND_WORD:
                    command = new RemoveCommand();
                    break;
                case ListCommand.COMMAND_WORD:
                    command = new ListCommand();
                    break;
                default:
                    command = new InvalidCommand();
                    break;
            }
            command.run(argument, res);
        });
    }
    else if (req.url !== '/favicon.ico') {
        res.end();
    }
    else {
        res.end();
    }
}).listen(3000);
