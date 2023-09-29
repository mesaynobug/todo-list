import { Command } from "./Command";
import { Database } from "./Database";
import { IOHandler } from "./IOHandler";
/**
 * A Command that executes when user input is not valid
 */
export class InvalidCommand implements Command {
    async run(input: string, handler: IOHandler, db: Database): Promise<void> {
        await handler.output("Invalid Command!");
    }
}
