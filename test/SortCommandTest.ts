import { SortCommand } from "../src/SortCommand";
import { ArrayDatabase } from "./ArrayDatabase";
import { test } from "node:test";
import { ServerResponse } from "node:http";
import assert from "node:assert";
import { Task } from "../src/Task";
import { TestIOHandler } from "../src/TestIOHandler";

test("Tasks should be sorted by priority", async () => {
    const json = {
        tasks: [
            {
                desc: "lynnsupergay",
                id: 1,
                complete: false,
                date: "December 25th 2022, 1:26 pm",
                priority: 1,
                tags: ["supergay", "megagay"],
            },
            {
                desc: "assssssss",
                id: 2,
                complete: false,
                date: "December 7th 2022, 1:48 pm",
                priority: 10,
                tags: [],
            },
            {
                desc: "noooooooooo",
                id: 3,
                complete: false,
                date: "November 28th 2022, 1:46 pm",
                priority: 5,
                tags: [],
            },
        ],
        id: 22,
    };

    const jsonData = json as {
        tasks: any[];
        id: number;
        complete: boolean;
        date: Date;
        priority: number;
        tags: string[];
        archived: boolean;
    };

    const myDatabase = new ArrayDatabase();
    const ioHandler = new TestIOHandler(null as unknown as ServerResponse);

    myDatabase.tasks = jsonData.tasks.map((task) => {
        const t = new Task(task.desc, task.id, task.date, task.complete);
        t.setPriority(task.priority);
        t.setTags(task.tags);
        t.setArchived(task.archived);
        return t;
    });

    await new SortCommand().run("priority", ioHandler, myDatabase);

    assert.strictEqual(myDatabase.tasks[0].getId(), 2);
    assert.strictEqual(myDatabase.tasks[1].getId(), 3);
    assert.strictEqual(myDatabase.tasks[2].getId(), 1);
});

test("Tasks should be sorted by id", async () => {
    const json = {
        tasks: [
            {
                desc: "lynnsupergay",
                id: 3,
                complete: false,
                date: "December 25th 2022, 1:26 pm",
                priority: 1,
                tags: ["supergay", "megagay"],
            },
            {
                desc: "assssssss",
                id: 1,
                complete: false,
                date: "December 7th 2022, 1:48 pm",
                priority: 10,
                tags: [],
            },
            {
                desc: "noooooooooo",
                id: 2,
                complete: false,
                date: "November 28th 2022, 1:46 pm",
                priority: 5,
                tags: [],
            },
        ],
        id: 22,
    };

    const jsonData = json as {
        tasks: any[];
        id: number;
        complete: boolean;
        date: Date;
        priority: number;
        tags: string[];
        archived: boolean;
    };

    const myDatabase = new ArrayDatabase();
    const ioHandler = new TestIOHandler(null as unknown as ServerResponse);

    myDatabase.tasks = jsonData.tasks.map((task) => {
        const t = new Task(task.desc, task.id, task.date, task.complete);
        t.setPriority(task.priority);
        t.setTags(task.tags);
        t.setArchived(task.archived);
        return t;
    });

    await new SortCommand().run("id", ioHandler, myDatabase);

    console.log(myDatabase.tasks[0].getId());
    console.log(myDatabase.tasks[1].getId());
    console.log(myDatabase.tasks[2].getId());

    assert.strictEqual(myDatabase.tasks[0].getId(), 1);
    assert.strictEqual(myDatabase.tasks[1].getId(), 2);
    assert.strictEqual(myDatabase.tasks[2].getId(), 3);
});

test("Tasks should be sorted by due date", async () => {
    const json = {
        tasks: [
            {
                desc: "lynnsupergay",
                id: 1,
                complete: false,
                date: "December 25th 2026, 1:26 pm",
                priority: 1,
                tags: ["supergay", "megagay"],
            },
            {
                desc: "assssssss",
                id: 2,
                complete: false,
                date: "December 7th 2024, 1:48 pm",
                priority: 10,
                tags: [],
            },
            {
                desc: "noooooooooo",
                id: 3,
                complete: false,
                date: "November 28th 2025, 1:46 pm",
                priority: 5,
                tags: [],
            },
        ],
        id: 22,
    };

    const jsonData = json as {
        tasks: any[];
        id: number;
        complete: boolean;
        date: Date;
        priority: number;
        tags: string[];
        archived: boolean;
    };

    const myDatabase = new ArrayDatabase();
    const ioHandler = new TestIOHandler(null as unknown as ServerResponse);

    myDatabase.tasks = jsonData.tasks.map((task) => {
        const t = new Task(task.desc, task.id, task.date, task.complete);
        t.setPriority(task.priority);
        t.setTags(task.tags);
        t.setArchived(task.archived);
        return t;
    });

    await new SortCommand().run("due", ioHandler, myDatabase);

    assert.strictEqual(myDatabase.tasks[0].getId(), 2);
    assert.strictEqual(myDatabase.tasks[1].getId(), 3);
    assert.strictEqual(myDatabase.tasks[2].getId(), 1);
});
