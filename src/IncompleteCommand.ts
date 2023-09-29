import { Command } from "./Command";
import { Database } from "./Database";
import { IOHandler } from "./IOHandler";
/**
 * Marks task as incomplete
 */
export class IncompleteCommand implements Command {
    static readonly COMMAND_WORD: string = "incomplete";
    async run(input: string, handler: IOHandler, db: Database): Promise<void> {
        const updateTask = await db.read(parseInt(input));
        updateTask.setComplete(false);
        await db.update(parseInt(input), updateTask);
        await handler.output("Task " + input + " marked incomplete.");
    }
}
