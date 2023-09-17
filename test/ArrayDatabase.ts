import { Database } from "../src/Database";
import { Task } from "../src/Task";
import moment from "moment";

export class ArrayDatabase implements Database {
    /** Array of all stored tasks */
    tasks: Task[];
    /** Lowest unused id */
    id: number;
    async create(desc: string, date: string): Promise<number> {
        this.tasks.push(new Task(desc, this.id, date));
        this.id++;
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
            this.tasks[taskIndex].addTag(tag);
            return 1;
        }
        return 0;
    }
    async removeTag(id: number, tag: string) {
        const taskIndex: number = this.tasks.findIndex(
            (task) => task.getId() == id
        );
        if (taskIndex !== -1) {
            this.tasks[taskIndex].removeTag(tag);
            return 1;
        }
        return 0;
    }
    /**
     * Creates a new array database
     */
    constructor() {
        this.tasks = [];
        this.id = 1;
    }
}
