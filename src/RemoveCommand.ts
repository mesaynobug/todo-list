import { Command } from "./Command";
import { Database } from "./Database";
import { ServerResponse } from "http";
/**
 * Deletes a task object
 */
export class RemoveCommand implements Command {
    static readonly COMMAND_WORD: string = "remove";
    async run(input: string, res: ServerResponse, db: Database): Promise<void> {
        await db.delete(parseInt(input));
        if (res != null) res.write("Task deleted.");
    }
}
