import { createServer, IncomingMessage, ServerResponse } from "http";

class Task{
    desc: string;
    id: number;

    constructor(desc: string, id:number){
        this.desc = desc;
        this.id = id;
    }
}

interface Command{
    readonly name: string,
    command: (input: string, res: ServerResponse) => void;
}

let tasks: Task[] = [];
let id: number = 1;
let tasksStr: string = "";
let myForm: string = `<form action="" method="post">
                      <input type="text" id="textBox" name=textBox autofocus="autofocus">
                      <button type="submit">Hello!</button>
                      </form>`;

createServer(function (req: IncomingMessage, res: ServerResponse) {
    function addTask(task: string){tasks.push(new Task(task,id++))
        res.write("Added a new task.");}

    function removeTask(argument: number){tasks = tasks.filter(task => task.id !== argument);
        res.write("Task deleted.");}

    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(myForm);
    tasksStr = "";

    if (req.method === "POST") {
        let data: string = "";

        req.on("data", (chunk) => {
            data += chunk;});

        req.on("end", () => {
            let usp: URLSearchParams = new URLSearchParams(data);
            let command: string = usp.get("textBox")!.substring(0,usp.get("textBox")!.indexOf(' '));
            if (usp.get("textBox")!.indexOf(' ') === -1){command = usp.get("textBox")!;}
            let argument: string = usp.get("textBox")!.substring(usp.get("textBox")!.indexOf(' ')+1);

            if (command === "delete" && tasks.some(e => e.id === parseInt(argument))){
                removeTask(parseInt(argument));}
            
            else if(command === "todo" && argument != ""){addTask(argument);}

            else if (command === "list"){
                tasks.forEach(task => tasksStr += task.id + ": " + task.desc + "<br>");
  
            res.write(tasksStr);
            res.end();}
        });
    }
    else if(req.url !== '/favicon.ico'){res.end();}
    else{res.end();}
}).listen(3000);