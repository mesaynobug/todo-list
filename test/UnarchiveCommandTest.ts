import { UnarchiveCommand } from "../src/UnarchiveCommand";
import { ArrayDatabase } from "./ArrayDatabase";
import { test } from "node:test";
import { ServerResponse } from "node:http";
import assert from "node:assert";
import { Task } from "../src/Task";

test("Archived Task should have false archived attribute", async () => {
    const myDatabase = new ArrayDatabase();
    const testTask = new Task("ass", 1, "November 28th 2022, 1:46 pm");
    testTask.setArchived(true);
    myDatabase.tasks.push(testTask);

    new UnarchiveCommand().run(
        "1",
        null as unknown as ServerResponse,
        myDatabase
    );

    assert.strictEqual((await myDatabase.read(1)).getArchived(), false);
});
