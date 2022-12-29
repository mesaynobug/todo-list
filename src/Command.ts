import { Database } from "./Database";
import { ServerResponse } from "http";
/**
 * Represents a command for the to-do list
 */
export interface Command {
    /**
     * Runs the command
     * @param input User input from the command box
     * @param res The ServerResponse object to write to
     * @param db The database to interact with
     * @param date Optional parameter for certain commands
     */
    run(
        input: string,
        res: ServerResponse,
        db: Database,
        date?: string
    ): Promise<void>;
}
