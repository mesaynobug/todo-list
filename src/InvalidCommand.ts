import { Command } from "./Command";
import { Database } from "./Database";
import { ServerResponse } from "http";
/**
 * A Command that executes when user input is not valid
 */
export class InvalidCommand implements Command {
    async run(input: string, res: ServerResponse, db: Database): Promise<void> {
        if (res != null) res.write("Invalid Command!");
    }
}
