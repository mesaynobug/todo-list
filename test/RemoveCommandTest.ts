import { RemoveCommand } from "../src/RemoveCommand";
import { ArrayDatabase } from "./ArrayDatabase";
import { test } from "node:test";
import assert from "node:assert";
import { Task } from "../src/Task";
import { TestIOHandler } from "../src/TestIOHandler";

test("Task should be removed from database", async () => {
    const myDatabase = new ArrayDatabase();
    const ioHandler = new TestIOHandler();
    const testTask = new Task("ass", 1, "November 28th 2022, 1:46 pm");
    myDatabase.tasks.push(testTask);

    await new RemoveCommand().run(
        "1",
        ioHandler,
        myDatabase
    );

    assert.notStrictEqual((await myDatabase.read(1)).getId(), 1);
});
