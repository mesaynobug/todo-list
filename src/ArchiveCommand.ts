import { Command } from "./Command";
import { Database } from "./Database";
import { IOHandler } from "./IOHandler";
/**
 * Archive specified task
 */
export class ArchiveCommand implements Command {
    static readonly COMMAND_WORD: string = "archive";
    async run(input: string, handler: IOHandler, db: Database): Promise<void> {
        const updateTask = await db.read(parseInt(input));
        updateTask.setArchived(true);
        await db.update(parseInt(input), updateTask);
        await handler.output("Task " + input + " archived.");
    }
}
