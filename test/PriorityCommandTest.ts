import { PriorityCommand } from "../src/PriorityCommand";
import { ArrayDatabase } from "./ArrayDatabase";
import { test } from "node:test";
import { ServerResponse } from "node:http";
import assert from "node:assert";
import { Task } from "../src/Task";
import { TestIOHandler } from "../src/TestIOHandler";

test("Task should have priority changed to 1337", async () => {
    const myDatabase = new ArrayDatabase();
    const ioHandler = new TestIOHandler(null as unknown as ServerResponse);
    const testTask = new Task("ass", 1, "November 28th 2022, 1:46 pm");
    testTask.setPriority(1);
    myDatabase.tasks.push(testTask);

    await new PriorityCommand().run("1 1337", ioHandler, myDatabase);

    assert.strictEqual((await myDatabase.read(1)).getPriority(), 1337);
});
