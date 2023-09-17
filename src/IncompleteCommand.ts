import { Command } from "./Command";
import { Database } from "./Database";
import { ServerResponse } from "http";
/**
 * Marks task as incomplete
 */
export class IncompleteCommand implements Command {
    static readonly COMMAND_WORD: string = "incomplete";
    async run(input: string, res: ServerResponse, db: Database): Promise<void> {
        const updateTask = await db.read(parseInt(input));
        updateTask.setComplete(false);
        await db.update(parseInt(input), updateTask);
        if (res != null) res.write("Task " + input + " marked incomplete.");
    }
}
