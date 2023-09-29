import { Command } from "./Command";
import { Database } from "./Database";
import { IOHandler } from "./IOHandler";
/**
 * Creates a new task object
 */
export class AddCommand implements Command {
    static readonly COMMAND_WORD: string = "todo";
    async run(
        input: string,
        handler: IOHandler,
        db: Database,
        date: string
    ): Promise<void> {
        await db.create(input, date);
        await handler.output("Added a new task.");
    }
}
