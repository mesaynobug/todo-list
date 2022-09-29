import { createServer, IncomingMessage, ServerResponse } from "http";
class Task{
    desc: string;
    id: number;

    constructor(desc: string, id:number){
        this.desc = desc;
        this.id = id;
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
    function writeTasks(){
        for (let element in tasks) {
            tasksStr += tasks[element].id + ": " + tasks[element].desc + "<br>";
        }
        res.write(tasksStr);
        res.end();}

    function addTask(task: string){tasks.push(new Task(task,id++))}

    function removeTask(argument: number){tasks.filter(task => task.id !== argument);}

    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(myForm);
    tasksStr = "";
    if (req.method == "POST") {
        let data: string = "";
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", () => {
            let usp: URLSearchParams = new URLSearchParams(data);
            let command: string = usp.get("textBox")!.substring(0,usp.get("textBox")!.indexOf(' '));
            let argument: string = usp.get("textBox")!.substring(usp.get("textBox")!.indexOf(' ')+1);

            if (command == "delete" && tasks.some(e => e.id == parseInt(argument))){
                removeTask(parseInt(argument));}
            
            else if(command == "todo" && argument != ""){addTask(argument);}

            writeTasks();
        });
    }
    else if(req.url === '/favicon.ico'){res.end();}
    else{
        writeTasks();
        }
}).listen(3000);