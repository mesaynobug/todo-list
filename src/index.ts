import { createServer, IncomingMessage, ServerResponse } from "http";

class Task{
    private desc: string;
    private id: number;
    private complete: boolean;

    constructor(desc: string, id:number){
        this.desc = desc;
        this.id = id;
        this.complete = false;
    }

    getDesc(){
        return this.desc;
    }
    getId(){
        return this.id;
    }
    getComplete(){
        return this.complete;
    }
    setDesc(desc:string){
        this.desc = desc;
    }
    setId(id:number){
        this.id = id;
    }
    setComplete(complete:boolean){
        this.complete = complete;
    }
    toString(){
        return (this.id + ": " + this.desc + " | Complete: " + this.complete + "<br>")
    }
}

interface Command{
    run(input:string, res:ServerResponse, db:Database):Promise<void>;
}

interface Database{
    create(task:Task):Promise<Number>
    read(id: Number):Promise<Task>
    update(id: Number, task:Task):Promise<Boolean>
    delete(id: Number):Promise<Boolean>
    list():Promise<Number[]>
}

class ArrayDatabase implements Database{
    tasks: Task[] = [];
    async create(task:Task):Promise<Number>{
        this.tasks.push(task);
        return task.id
    }
    async read(id: Number):Promise<Task>{
        let readTask:Task|undefined = tasks.find(task => task.id == id)
        if (readTask !== undefined){return readTask}
        else {return new Task("",-1)}
    }
    async update(id: Number, task:Task):Promise<Boolean>{
        let updateIndex:number|undefined = tasks.findIndex(task => task.id == id)
        if (updateIndex !== undefined){
            tasks[updateIndex] = task
            return true
        }
        return false
    }
    async delete(id: Number):Promise<Boolean>{
        let deleteTask:Task|undefined = tasks.find(task => task.id == id)
        if (deleteTask !== undefined){
            tasks = tasks.filter(task => task !== deleteTask);
            return true
        }
        return false
    }
    async list():Promise<Number[]>{
        let idArr:Number[] = [];
        tasks.forEach(task => idArr.push(task.id))
        return idArr
    }
}

class AddCommand implements Command{
    static readonly COMMAND_WORD:string = "todo"
    async run(input:string, res:ServerResponse, db:Database):Promise<void>{
        await db.create(new Task(input,id++));
        res.write("Added a new task.");
    }
}

class RemoveCommand implements Command{
    static readonly COMMAND_WORD:string = "remove"
    async run(input:string, res:ServerResponse, db:Database):Promise<void>{
        
        res.write("Task deleted.");
    }
}

class ListCommand implements Command{
    static readonly COMMAND_WORD:string = "list";
    async run(input:string, res:ServerResponse, db:Database):Promise<void>{
        tasks.forEach(task => tasksStr += task.id + ": " + task.desc + " | Complete: " + task.complete + "<br>");
        res.write(tasksStr);
        res.end();
    }
}

class CompleteCommand implements Command{
    static readonly COMMAND_WORD:string = "complete";
    async run(input:string, res:ServerResponse, db:Database):Promise<void>{
        tasks.find(task => task.id == parseInt(input))!.complete = true;
        res.write("Task "+input+" marked complete.")
    }    
}

class IncompleteCommand implements Command{
    static readonly COMMAND_WORD:string = "incomplete";
    async run(input:string, res:ServerResponse, db:Database):Promise<void>{
        tasks.find(task => task.id == parseInt(input))!.complete = false;
        res.write("Task "+input+" marked incomplete.")
    }    
}

class InvalidCommand implements Command{
    async run(input:string, res:ServerResponse, db:Database):Promise<void>{
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

let myDatabase:Database = new ArrayDatabase();

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
            command.run(argument,res,myDatabase);});
    }
    else if(req.url !== '/favicon.ico'){res.end();}
    else{res.end();}
}).listen(3000);