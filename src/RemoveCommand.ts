import { Command } from "./Command";
import { Database } from "./Database";
import { IOHandler } from "./IOHandler";
/**
 * Deletes a task object
 */
export class RemoveCommand implements Command {
    static readonly COMMAND_WORD: string = "remove";
    async run(input: string, handler: IOHandler, db: Database): Promise<void> {
        await db.delete(parseInt(input));
        await handler.output("Task deleted.");
    }
}
