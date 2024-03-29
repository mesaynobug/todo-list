import { AddCommand } from "../src/AddCommand";
import { ArrayDatabase } from "./ArrayDatabase";
import { test } from "node:test";
import { ServerResponse } from "node:http";
import moment from "moment";
import assert from "node:assert";

const myDatabase = new ArrayDatabase();

test("Task should be added to database at index 1", async () => {
    const timeDate = moment(new Date()).format("MMMM Do YYYY, h:mm a");
    new AddCommand().run(
        "ass",
        null as unknown as ServerResponse,
        myDatabase,
        timeDate
    );
    assert.strictEqual((await myDatabase.read(1)).getDesc(), "ass");
});
