import { Command } from "./Command";
import { Database } from "./Database";
import { IOHandler } from "./IOHandler";
/**
 * Unarchive specified task
 */
export class UnarchiveCommand implements Command {
    static readonly COMMAND_WORD: string = "unarchive";
    async run(input: string, handler: IOHandler, db: Database): Promise<void> {
        const updateTask = await db.read(parseInt(input));
        updateTask.setArchived(false);
        await db.update(parseInt(input), updateTask);
        await handler.output("Task " + input + " restored from archives.");
    }
}
