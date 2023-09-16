import { TagCommand } from "../src/TagCommand";
import { ArrayDatabase } from "./ArrayDatabase";
import { test } from "node:test";
import { ServerResponse } from "node:http";
import assert from "node:assert";
import { Task } from "../src/Task";

test("Task should have Hello and Hi appended to list of tags", async () => {
    const myDatabase = new ArrayDatabase();
    const testTask = new Task("ass", 1, "November 28th 2022, 1:46 pm");
    testTask.setTags([]);
    myDatabase.tasks.push(testTask);

    await new TagCommand().run(
        "add 1 Hello",
        null as unknown as ServerResponse,
        myDatabase
    );
    await new TagCommand().run(
        "add 1 Hi",
        null as unknown as ServerResponse,
        myDatabase
    );

    assert.strictEqual(
        (await myDatabase.read(1)).getTags().toString(),
        "Hello,Hi"
    );
});

test("Task should have Hello and Hi removed from the list of tags", async () => {
    const myDatabase = new ArrayDatabase();
    const testTask = new Task("ass", 1, "November 28th 2022, 1:46 pm");
    testTask.setTags(["Hello", "Hi"]);
    myDatabase.tasks.push(testTask);

    await new TagCommand().run(
        "remove 1 Hello",
        null as unknown as ServerResponse,
        myDatabase
    );
    await new TagCommand().run(
        "remove 1 Hi",
        null as unknown as ServerResponse,
        myDatabase
    );
    assert.strictEqual((await myDatabase.read(1)).getTags().toString(), "");
});
