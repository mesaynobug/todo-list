import { Command } from "./Command";
import { Database } from "./Database";
import { ServerResponse } from "http";
/**
 * Changes the priority of tasks
 */
export class PriorityCommand implements Command {
    static readonly COMMAND_WORD: string = "priority";
    async run(input: string, res: ServerResponse, db: Database): Promise<void> {
        const arrInput = input.split(" ");
        if (!isNaN(parseInt(arrInput[0])) && !isNaN(parseInt(arrInput[1]))) {
            const updateTask = await db.read(parseInt(arrInput[0]));
            updateTask.setPriority(parseInt(arrInput[1]));
            await db.update(parseInt(arrInput[0]), updateTask);
            if (res != null)
                res.write("Task " + arrInput[0] + " priority changed.");
        }
    }
}
