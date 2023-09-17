import { Command } from "./Command";
import { Database } from "./Database";
import { ServerResponse } from "http";
/**
 * Sorts tasks by given attribute
 */
export class SortCommand implements Command {
    static readonly COMMAND_WORD: string = "sort";
    async run(input: string, res: ServerResponse, db: Database): Promise<void> {
        db.taskSort(input);
        if (res != null) res.write("Sorted by :" + input);
    }
}
