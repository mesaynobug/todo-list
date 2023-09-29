import { Command } from "./Command";
import { Database } from "./Database";
import { IOHandler } from "./IOHandler";
/**
 * Marks task as complete
 */
export class CompleteCommand implements Command {
    static readonly COMMAND_WORD: string = "complete";
    async run(input: string, handler: IOHandler, db: Database): Promise<void> {
        const updateTask = await db.read(parseInt(input));
        updateTask.setComplete(true);
        await db.update(parseInt(input), updateTask);
        await handler.output("Task " + input + " marked complete.");
    }
}
