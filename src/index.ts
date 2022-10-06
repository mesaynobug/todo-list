import { createServer, IncomingMessage, ServerResponse } from "http";

class Task{
    desc: string;
    id: number;
    complete: boolean;

    constructor(desc: string, id:number){
        this.desc = desc;
        this.id = id;
        this.complete = false;
    }
}

interface Command{
    run(input:string, res:ServerResponse):void;
}

class AddCommand implements Command{
    static readonly COMMAND_WORD:string = "todo"
    run(input:string, res:ServerResponse):void{
        tasks.push(new Task(input,id++))
        res.write("Added a new task.");
    }
}

class RemoveCommand implements Command{
    static readonly COMMAND_WORD:string = "remove"
    run(input:string, res:ServerResponse):void{
        tasks = tasks.filter(task => task.id.toString() !== input);
        res.write("Task deleted.");
    }
}

class ListCommand implements Command{
    static readonly COMMAND_WORD:string = "list";
    run(input:string, res:ServerResponse):void{
        tasks.forEach(task => tasksStr += task.id + ": " + task.desc + " | Complete: " + task.complete + "<br>");
        res.write(tasksStr);
        res.end();
    }
}

class CompleteCommand implements Command{
    static readonly COMMAND_WORD:string = "complete";
    run(input:string, res:ServerResponse):void{
        tasks.find(task => task.id == parseInt(input))!.complete = true;
        res.write("Task "+input+" marked complete.")
    }    
}

class IncompleteCommand implements Command{
    static readonly COMMAND_WORD:string = "incomplete";
    run(input:string, res:ServerResponse):void{
        tasks.find(task => task.id == parseInt(input))!.complete = false;
        res.write("Task "+input+" marked incomplete.")
    }    
}

class InvalidCommand implements Command{
    run(input:string, res:ServerResponse):void{
        res.write("Invalid Command!");
    }
}

let tasks: Task[] = [];
let id: number = 1;
let tasksStr: string = "";
let myForm: string = `<form action="" method="post">
                      <input type="text" id="textBox" name=textBox autofocus="autofocus">
                      <button type="submit">Hello!</button>
                      </form>`;

createServer(function (req: IncomingMessage, res: ServerResponse) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(myForm);
    tasksStr = "";

    if (req.method === "POST") {
        let data: string = "";

        req.on("data", (chunk) => {
            data += chunk;});

        req.on("end", () => {
            let usp: URLSearchParams = new URLSearchParams(data);
            let varCommand: string = usp.get("textBox")!.substring(0,usp.get("textBox")!.indexOf(' '));
                if (usp.get("textBox")!.indexOf(' ') == -1){varCommand = usp.get("textBox")!;}
            let argument: string = usp.get("textBox")!.substring(usp.get("textBox")!.indexOf(' ')+1);
            let command: Command;

            switch(varCommand.toLowerCase().trim()){
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
            command.run(argument,res);});
    }
    else if(req.url !== '/favicon.ico'){res.end();}
    else{res.end();}
}).listen(3000);