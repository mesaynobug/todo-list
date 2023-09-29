import { Command } from "./Command";
import { Database } from "./Database";
import { IOHandler } from "./IOHandler";
/**
 * Sorts tasks by given attribute
 */
export class SortCommand implements Command {
    static readonly COMMAND_WORD: string = "sort";
    async run(input: string, handler: IOHandler, db: Database): Promise<void> {
        db.taskSort(input);
        await handler.output("Sorted by :" + input);
    }
}
