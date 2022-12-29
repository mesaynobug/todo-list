import { Task } from "./Task";
import { Database } from "./Database";
import moment from "moment";
import { readFile, writeFile } from "fs";
/**
 *  Database implementation using a json file to store tasks
 */
export class JsonDatabase implements Database {
    /** Array of all stored tasks */
    private tasks: Task[];
    /** Lowest unused id */
    private id: number;
    /** Path to database json file */
    private fileName: string;
    async create(desc: string, date: string): Promise<number> {
        this.tasks.push(new Task(desc, this.id, date));
        this.id++;
        this.saveFile();
        return this.id - 1;
    }
    async read(id: number): Promise<Task> {
        const readTask: Task | undefined = this.tasks.find(
            (task) => task.getId() == id
        );
        if (readTask !== undefined) {
            return readTask;
        } else {
            return new Task("Invalid ID", -1, "");
        }
    }
    async update(id: number, task: Task): Promise<boolean> {
        const updateIndex: number | undefined = this.tasks.findIndex(
            (task) => task.getId() == id
        );
        if (updateIndex !== undefined) {
            this.tasks[updateIndex] = task;
            this.saveFile();
            return true;
        }
        return false;
    }
    async delete(id: number): Promise<boolean> {
        const deleteTask: Task | undefined = this.tasks.find(
            (task) => task.getId() == id
        );
        if (deleteTask !== undefined) {
            this.tasks = this.tasks.filter((task) => task !== deleteTask);
            this.saveFile();
            return true;
        }
        return false;
    }
    async list(): Promise<number[]> {
        const idArr: number[] = [];
        this.tasks.map((task) => {
            idArr.push(task.getId());
        });
        return idArr;
    }

    taskSort(input: string) {
        if (input.trim() === "due") {
            this.tasks.sort((task1, task2) => {
                if (
                    moment(task1.getDate(), "MMMM Do YYYY, h:mm a") >
                    moment(task2.getDate(), "MMMM Do YYYY, h:mm a")
                ) {
                    return 1;
                }
                if (
                    moment(task2.getDate(), "MMMM Do YYYY, h:mm a") >
                    moment(task1.getDate(), "MMMM Do YYYY, h:mm a")
                ) {
                    return -1;
                }
                return 0;
            });
        } else if (input.trim() === "id") {
            this.tasks.sort((task1, task2) => {
                if (task1.getId() > task2.getId()) {
                    return 1;
                }
                if (task2.getId() > task1.getId()) {
                    return -1;
                }
                return 0;
            });
        } else if (input.trim() === "priority") {
            this.tasks.sort((task1, task2) => {
                if (task1.getPriority() < task2.getPriority()) {
                    return 1;
                }
                if (task2.getPriority() < task1.getPriority()) {
                    return -1;
                }
                return 0;
            });
        }
    }
    async addTag(id: number, tag: string) {
        const taskIndex: number = this.tasks.findIndex(
            (task) => task.getId() == id
        );
        if (taskIndex !== -1) {
            const success: number = this.tasks[taskIndex].addTag(tag);
            if (success === 1) this.saveFile();
            return 1;
        }
        return 0;
    }
    async removeTag(id: number, tag: string) {
        const taskIndex: number = this.tasks.findIndex(
            (task) => task.getId() == id
        );
        if (taskIndex !== -1) {
            const success: number = this.tasks[taskIndex].removeTag(tag);
            if (success === 1) this.saveFile();
            return 1;
        }
        return 0;
    }
    /**
     * Creates a new json database
     * @param fileName The path to the json file
     */
    constructor(fileName: string) {
        this.tasks = [];
        this.id = 1;
        readFile(fileName, (err, data) => {
            const jsonData = JSON.parse(data.toString()) as {
                tasks: any[];
                id: number;
                complete: boolean;
                date: Date;
                priority: number;
                tags: string[];
                archived: boolean;
            };
            this.tasks = jsonData.tasks.map((task) => {
                const t = new Task(
                    task.desc,
                    task.id,
                    task.date,
                    task.complete
                );
                t.setPriority(task.priority);
                t.setTags(task.tags);
                return t;
            });
            this.id = jsonData.id;
        });
        this.fileName = fileName;
    }
    /**
     * Write the content of tasks back to the json file
     */
    private saveFile() {
        writeFile(
            this.fileName,
            JSON.stringify({
                tasks: this.tasks.map((task) => ({
                    desc: task.getDesc(),
                    id: task.getId(),
                    complete: task.getComplete(),
                    date: task.getDate(),
                    priority: task.getPriority(),
                    tags: task.getTags(),
                    archived: task.getArchived,
                })),
                id: this.id,
            }),
            (a) => {
                a;
            }
        );
    }
}
