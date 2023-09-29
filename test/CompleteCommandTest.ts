import { CompleteCommand } from "../src/CompleteCommand";
import { ArrayDatabase } from "./ArrayDatabase";
import { test } from "node:test";
import { ServerResponse } from "node:http";
import assert from "node:assert";
import { Task } from "../src/Task";
import { TestIOHandler } from "../src/TestIOHandler";

test("Task should be marked complete", async () => {
    const myDatabase = new ArrayDatabase();
    const ioHandler = new TestIOHandler(null as unknown as ServerResponse);
    const testTask = new Task("ass", 1, "November 28th 2022, 1:46 pm");
    testTask.setComplete(false);
    myDatabase.tasks.push(testTask);

    await new CompleteCommand().run("1", ioHandler, myDatabase);

    assert.strictEqual((await myDatabase.read(1)).getComplete(), true);
});
