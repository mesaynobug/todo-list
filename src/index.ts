import { createServer, IncomingMessage, ServerResponse } from "http";
import {readFile, writeFile} from "fs";

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
    create(desc:string):Promise<number>
    read(id: number):Promise<Task>
    update(id: number, task:Task):Promise<Boolean>
    delete(id: number):Promise<Boolean>
    list():Promise<number[]>
}

class ArrayDatabase implements Database{
    private tasks: Task[] = [];
    private id: number = 1;
    async create(desc:string):Promise<number>{
        this.tasks.push(new Task(desc,this.id));
        this.id++;
        return this.id-1;
    }
    async read(id: number):Promise<Task>{
        let readTask:Task|undefined = this.tasks.find(task => task.getId() == id)
        if (readTask !== undefined){return readTask}
        else {return new Task("Invalid ID",-1)}
    }
    async update(id: number, task:Task):Promise<Boolean>{
        let updateIndex:number|undefined = this.tasks.findIndex(task => task.getId() == id)
        if (updateIndex !== undefined){
            this.tasks[updateIndex] = task
            return true
        }
        return false
    }
    async delete(id: number):Promise<Boolean>{
        let deleteTask:Task|undefined = this.tasks.find(task => task.getId() == id)
        if (deleteTask !== undefined){
            this.tasks = this.tasks.filter(task => task !== deleteTask);
            return true
        }
        return false
    }
    async list():Promise<number[]>{
        let idArr:number[] = [];
        for (let i = 0; i<this.tasks.length;i++){
            idArr.push(this.tasks[i].getId());
        }
        return idArr
    }
}

class JsonDatabase implements Database{
    private tasks: Task[];
    private id: number;
    private fileName: string;
    async create(desc:string):Promise<number>{
        this.tasks.push(new Task(desc,this.id));
        this.id++;
        this.saveFile();
        return this.id-1;
    }
    async read(id: number):Promise<Task>{
        let readTask:Task|undefined = this.tasks.find(task => task.getId() == id)
        if (readTask !== undefined){return readTask}
        else {return new Task("Invalid ID",-1)}
    }
    async update(id: number, task:Task):Promise<Boolean>{
        let updateIndex:number|undefined = this.tasks.findIndex(task => task.getId() == id)
        if (updateIndex !== undefined){
            this.tasks[updateIndex] = task
            this.saveFile();
            return true
        }
        return false
    }
    async delete(id: number):Promise<Boolean>{
        let deleteTask:Task|undefined = this.tasks.find(task => task.getId() == id)
        if (deleteTask !== undefined){
            this.tasks = this.tasks.filter(task => task !== deleteTask);
            this.saveFile();
            return true
        }
        return false
    }
    async list():Promise<number[]>{
        let idArr:number[] = [];
        for (let i = 0; i<this.tasks.length;i++){
            idArr.push(this.tasks[i].getId());
        }
        return idArr
    }

    constructor(fileName:string){
        this.tasks = [];
        this.id = -69;
        readFile(fileName, (err, data) => {
            const jsonData  = JSON.parse(data.toString()) as {tasks: any[], id:number};
            this.tasks = jsonData.tasks.map(task => new Task(task.desc,task.id));
            this.id = jsonData.id;
        });
        this.fileName = fileName;
    }

    private saveFile(){
        writeFile(this.fileName,JSON.stringify({
            tasks: this.tasks.map(task => ({desc: task.getDesc(),id: task.getId()})),
            id: this.id
        }),()=>{})
    }
}

class AddCommand implements Command{
    static readonly COMMAND_WORD:string = "todo"
    async run(input:string, res:ServerResponse, db:Database):Promise<void>{
        await db.create(input);
        res.write("Added a new task.");
    }
}

class RemoveCommand implements Command{
    static readonly COMMAND_WORD:string = "remove"
    async run(input:string, res:ServerResponse, db:Database):Promise<void>{
        await db.delete(parseInt(input));
        res.write("Task deleted.");
    }
}

class ListCommand implements Command{
    static readonly COMMAND_WORD:string = "list";
    async run(input:string, res:ServerResponse, db:Database):Promise<void>{
        let tasksStr:string = "";
        let idArr:number[] = await db.list();
        for (let i = 0; i<idArr.length;i++){
            if (await (await db.read(idArr[i])).getDesc().search(input) !== -1 || input.trim() === ""){
                tasksStr += (await db.read(idArr[i])).toString();}
        }
        res.write(tasksStr);
        res.end();
    }
}

class CompleteCommand implements Command{
    static readonly COMMAND_WORD:string = "complete";
    async run(input:string, res:ServerResponse, db:Database):Promise<void>{
        let updateTask = await db.read(parseInt(input));
        updateTask.setComplete(true);
        await db.update(parseInt(input),updateTask);
        res.write("Task "+input+" marked complete.")
    }    
}

class IncompleteCommand implements Command{
    static readonly COMMAND_WORD:string = "incomplete";
    async run(input:string, res:ServerResponse, db:Database):Promise<void>{
        let updateTask = await db.read(parseInt(input));
        updateTask.setComplete(false);
        await db.update(parseInt(input),updateTask);
        res.write("Task "+input+" marked incomplete.")
    }    
}

class InvalidCommand implements Command{
    async run(input:string, res:ServerResponse, db:Database):Promise<void>{
        res.write("Invalid Command!");
    }
}

let myForm: string = `<form action="" method="post">
                      <input type="text" id="textBox" name=textBox autofocus="autofocus">
                      <button type="submit">Hello!</button>
                      </form>`;

let myDatabase:Database = new JsonDatabase("Hello.json");

createServer(function (req: IncomingMessage, res: ServerResponse) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(myForm);

    if (req.method === "POST") {
        let data: string = "";

        req.on("data", (chunk) => {
            data += chunk;});

        req.on("end", () => {
            let usp: URLSearchParams = new URLSearchParams(data);
            let varCommand: string = usp.get("textBox")!.substring(0,usp.get("textBox")!.indexOf(' '));
                if (usp.get("textBox")!.indexOf(' ') == -1){varCommand = usp.get("textBox")!;}
            let argument: string = usp.get("textBox")!.substring(varCommand.length+1);
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