import { ArrayDatabase } from "./ArrayDatabase";
import { test } from "node:test";
import assert from "node:assert";
import { Task } from "../src/Task";

const myDatabase = new ArrayDatabase();

test("Invalid id should result in an invalid task with id -1", async () => {
    myDatabase.tasks.push(new Task("ass", 1, ""));

    assert.strictEqual((await myDatabase.read(2)).getId(), -1);
});

test("Task should be properly updated", async () => {
    myDatabase.tasks.push(new Task("ass", 1, ""));
    myDatabase.update(1, new Task("hello", 1, ""));
    assert.strictEqual((await myDatabase.read(1)).getDesc(), "hello");
});
