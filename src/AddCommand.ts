import { Command } from "./Command";
import { Database } from "./Database";
import { ServerResponse } from "http";
/**
 * Creates a new task object
 */
export class AddCommand implements Command {
    static readonly COMMAND_WORD: string = "todo";
    async run(
        input: string,
        res: ServerResponse,
        db: Database,
        date: string
    ): Promise<void> {
        await db.create(input, date);
        res.write("Added a new task.");
    }
}
