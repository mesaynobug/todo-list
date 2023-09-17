import { Command } from "./Command";
import { Database } from "./Database";
import { ServerResponse } from "http";
/**
 * Unarchive specified task
 */
export class UnarchiveCommand implements Command {
    static readonly COMMAND_WORD: string = "unarchive";
    async run(input: string, res: ServerResponse, db: Database): Promise<void> {
        const updateTask = await db.read(parseInt(input));
        updateTask.setArchived(false);
        await db.update(parseInt(input), updateTask);
        if (res != null) res.write("Task " + input + " restore from archives.");
    }
}
