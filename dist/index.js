"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
class Task {
    constructor(desc, id) {
        this.desc = desc;
        this.id = id;
        this.complete = false;
    }
    getDesc() {
        return this.desc;
    }
    getId() {
        return this.id;
    }
    getComplete() {
        return this.complete;
    }
    setDesc(desc) {
        this.desc = desc;
    }
    setId(id) {
        this.id = id;
    }
    setComplete(complete) {
        this.complete = complete;
    }
    toString() {
        return (this.id + ": " + this.desc + " | Complete: " + this.complete + "<br>");
    }
}
class ArrayDatabase {
    constructor() {
        this.tasks = [];
        this.id = 1;
    }
    create(desc) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tasks.push(new Task(desc, this.id));
            this.id++;
            return this.id - 1;
        });
    }
    read(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let readTask = this.tasks.find(task => task.getId() == id);
            if (readTask !== undefined) {
                return readTask;
            }
            else {
                return new Task("Invalid ID", -1);
            }
        });
    }
    update(id, task) {
        return __awaiter(this, void 0, void 0, function* () {
            let updateIndex = this.tasks.findIndex(task => task.getId() == id);
            if (updateIndex !== undefined) {
                this.tasks[updateIndex] = task;
                return true;
            }
            return false;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let deleteTask = this.tasks.find(task => task.getId() == id);
            if (deleteTask !== undefined) {
                this.tasks = this.tasks.filter(task => task !== deleteTask);
                return true;
            }
            return false;
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            let idArr = [];
            for (let i = 0; i < this.tasks.length; i++) {
                idArr.push(this.tasks[i].getId());
            }
            return idArr;
        });
    }
}
class AddCommand {
    run(input, res, db) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.create(input);
            res.write("Added a new task.");
        });
    }
}
AddCommand.COMMAND_WORD = "todo";
class RemoveCommand {
    run(input, res, db) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.delete(parseInt(input));
            res.write("Task deleted.");
        });
    }
}
RemoveCommand.COMMAND_WORD = "remove";
class ListCommand {
    run(input, res, db) {
        return __awaiter(this, void 0, void 0, function* () {
            let tasksStr = "";
            let idArr = yield db.list();
            for (let i = 0; i < idArr.length; i++) {
                tasksStr += (yield db.read(idArr[i])).toString();
            }
            res.write(tasksStr);
            res.end();
        });
    }
}
ListCommand.COMMAND_WORD = "list";
class CompleteCommand {
    run(input, res, db) {
        return __awaiter(this, void 0, void 0, function* () {
            let updateTask = yield db.read(parseInt(input));
            updateTask.setComplete(true);
            yield db.update(parseInt(input), updateTask);
            res.write("Task " + input + " marked complete.");
        });
    }
}
CompleteCommand.COMMAND_WORD = "complete";
class IncompleteCommand {
    run(input, res, db) {
        return __awaiter(this, void 0, void 0, function* () {
            let updateTask = yield db.read(parseInt(input));
            updateTask.setComplete(false);
            yield db.update(parseInt(input), updateTask);
            res.write("Task " + input + " marked incomplete.");
        });
    }
}
IncompleteCommand.COMMAND_WORD = "incomplete";
class InvalidCommand {
    run(input, res, db) {
        return __awaiter(this, void 0, void 0, function* () {
            res.write("Invalid Command!");
        });
    }
}
let myForm = `<form action="" method="post">
                      <input type="text" id="textBox" name=textBox autofocus="autofocus">
                      <button type="submit">Hello!</button>
                      </form>`;
let myDatabase = new ArrayDatabase();
(0, http_1.createServer)(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(myForm);
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
                case CompleteCommand.COMMAND_WORD:
                    command = new CompleteCommand();
                    break;
                case IncompleteCommand.COMMAND_WORD:
                    command = new IncompleteCommand();
                    break;
                default:
                    command = new InvalidCommand();
                    break;
            }
            command.run(argument, res, myDatabase);
        });
    }
    else if (req.url !== '/favicon.ico') {
        res.end();
    }
    else {
        res.end();
    }
}).listen(3000);
