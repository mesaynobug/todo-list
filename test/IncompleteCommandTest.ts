import { IncompleteCommand } from "../src/IncompleteCommand";
import { ArrayDatabase } from "./ArrayDatabase";
import { test } from "node:test";
import { ServerResponse } from "node:http";
import assert from "node:assert";
import { Task } from "../src/Task";

test("Task should be marked incomplete", async () => {
    const myDatabase = new ArrayDatabase();
    const testTask = new Task("ass", 1, "November 28th 2022, 1:46 pm");
    testTask.setComplete(true);
    myDatabase.tasks.push(testTask);

    await new IncompleteCommand().run(
        "1",
        null as unknown as ServerResponse,
        myDatabase
    );

    assert.strictEqual((await myDatabase.read(1)).getComplete(), false);
});
