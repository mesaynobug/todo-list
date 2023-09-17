import { Command } from "./Command";
import { Database } from "./Database";
import { ServerResponse } from "http";
/**
 * Marks task as complete
 */
export class CompleteCommand implements Command {
    static readonly COMMAND_WORD: string = "complete";
    async run(input: string, res: ServerResponse, db: Database): Promise<void> {
        const updateTask = await db.read(parseInt(input));
        updateTask.setComplete(true);
        await db.update(parseInt(input), updateTask);
        if (res != null) res.write("Task " + input + " marked complete.");
    }
}
