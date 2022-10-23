import { createServer, IncomingMessage, ServerResponse } from "http";
import {readFile, writeFile} from "fs";
import moment from "moment";

class Task{
    private desc: string;
    private id: number;
    private complete: boolean;
    private date: string;

    constructor(desc: string, id:number, date:string, complete?:boolean,){
        this.desc = desc;
        this.id = id;
        this.complete = false;
        if (complete !== undefined){this.complete = complete;}
        this.date = date;
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
    getDate(){
        return this.date;
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
    setDate(date:string){
        this.date = date;
    }
    toString(){
        return (this.id + ": " + this.desc + " | Complete: " + this.complete + " | Due: " + this.date + " (" + moment().to(moment(this.getDate(),'MMMM Do YYYY, h:mm a')) + ")" + "<br>")
    }
}

interface Command{
    run(input:string, res:ServerResponse, db:Database, date?:string):Promise<void>;
}

interface Database{
    create(desc:string, date?:string):Promise<number>
    read(id: number):Promise<Task>
    update(id: number, task:Task):Promise<Boolean>
    delete(id: number):Promise<Boolean>
    list():Promise<number[]>
    taskSort(input:string):void
}

`class ArrayDatabase implements Database{
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
        this.tasks.map(task => {
            idArr.push(task.getId());
        })
        return idArr
    }
}
`

class JsonDatabase implements Database{
    private tasks: Task[];
    private id: number;
    private fileName: string;
    async create(desc:string, date:string):Promise<number>{
        this.tasks.push(new Task(desc,this.id,date));
        this.id++;
        this.saveFile();
        return this.id-1;
    }
    async read(id: number):Promise<Task>{
        let readTask:Task|undefined = this.tasks.find(task => task.getId() == id)
        if (readTask !== undefined){return readTask}
        else {return new Task("Invalid ID",-1,"")}
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
        this.tasks.map(task => {
            idArr.push(task.getId());
        })
        return idArr
    }

    taskSort(input:string){
        if (input.trim() === "due"){
            this.tasks.sort((task1,task2) => {
                if (moment(task1.getDate(),'MMMM Do YYYY, h:mm a') > moment(task2.getDate(),'MMMM Do YYYY, h:mm a')) {
                    return 1;
                }
                if (moment(task2.getDate(),'MMMM Do YYYY, h:mm a') > moment(task1.getDate(),'MMMM Do YYYY, h:mm a')) {
                    return -1;
                }   
                return 0;
            });
        }
        else if (input.trim() === "id"){
            this.tasks.sort((task1,task2) => {
                if (task1.getId() > task2.getId()) {
                    return 1;
                }
                if (task2.getId() > task1.getId()) {
                    return -1;
                }
                return 0;
            });
        }
    }

    constructor(fileName:string){
        this.tasks = [];
        this.id = 1;
        readFile(fileName, (err, data) => {
                const jsonData  = JSON.parse(data.toString()) as {tasks: any[], id:number, complete:boolean, date:Date};
                this.tasks = jsonData.tasks.map(task => new Task(task.desc,task.id,task.date,task.complete));
                this.id = jsonData.id;}
        );
        this.fileName = fileName;
    }

    private saveFile(){
        writeFile(this.fileName,JSON.stringify({
            tasks: this.tasks.map(task => ({desc: task.getDesc(),id: task.getId(),complete: task.getComplete(), date: task.getDate()})),
            id: this.id
        }),()=>{})
    }
}

class AddCommand implements Command{
    static readonly COMMAND_WORD:string = "todo"
    async run(input:string, res:ServerResponse, db:Database, date:string):Promise<void>{
        await db.create(input,date);
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
        let taskArr:Task[];
        taskArr = await Promise.all((idArr.map(id => db.read(id))));
        taskArr.map(task => {
            if (task.getDesc().search(input) !== -1 || input.trim() === ""){
                tasksStr += task.toString();}
        })
        res.write(tasksStr);
        res.end();
    }
}

class SortCommand implements Command{
    static readonly COMMAND_WORD:string = "sort";
    async run(input: string, res: ServerResponse, db: Database):Promise<void>{
    db.taskSort(input);    
    res.write("Sorted by :"+input);
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
                      Due:      <input type="date" name="date"><input type="time" name="time">
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
            const time = usp.get("time");
            const date = usp.get("date");
            const timeDate = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm:ss').format('MMMM Do YYYY, h:mm a');

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
                case SortCommand.COMMAND_WORD:
                    command = new SortCommand();
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
            command.run(argument,res,myDatabase,timeDate);});
    }
    else if(req.url !== '/favicon.ico'){res.end();}
    else{res.end();}
}).listen(3000);