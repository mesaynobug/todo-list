import { AddCommand } from "../src/AddCommand";
import { ArrayDatabase } from "./ArrayDatabase";
import { test } from "node:test";
import { TestIOHandler } from "../src/TestIOHandler";
import moment from "moment";
import { ServerResponse } from "node:http";
import assert from "node:assert";

const myDatabase = new ArrayDatabase();
const ioHandler = new TestIOHandler(null as unknown as ServerResponse);

test("Task should be added to database at index 1", async (): Promise<void> => {
    const timeDate = moment(new Date()).format("MMMM Do YYYY, h:mm a");
    await new AddCommand().run("ass", ioHandler, myDatabase, timeDate);
    await assert.strictEqual((await myDatabase.read(1)).getDesc(), "ass");
});
