import { RemoveCommand } from "../src/RemoveCommand";
import { ArrayDatabase } from "./ArrayDatabase";
import { test } from "node:test";
import { ServerResponse } from "node:http";
import assert from "node:assert";
import { Task } from "../src/Task";

test("Task should be removed from database", async () => {
    const myDatabase = new ArrayDatabase();
    const testTask = new Task("ass", 1, "November 28th 2022, 1:46 pm");
    myDatabase.tasks.push(testTask);

    await new RemoveCommand().run(
        "1",
        null as unknown as ServerResponse,
        myDatabase
    );

    assert.notStrictEqual((await myDatabase.read(1)).getId(), 1);
});
