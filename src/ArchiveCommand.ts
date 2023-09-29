import { Command } from "./Command";
import { Database } from "./Database";
import { ServerResponse } from "http";
/**
 * Archive specified task
 */
export class ArchiveCommand implements Command {
    static readonly COMMAND_WORD: string = "archive";
    async run(input: string, res: ServerResponse, db: Database): Promise<void> {
        const updateTask = await db.read(parseInt(input));
        updateTask.setArchived(true);
        await db.update(parseInt(input), updateTask);
        if (res != null) res.write("Task " + input + " archived.");
        else console.log("THIS SHOULD NOT EXECUTE");
    }
}
