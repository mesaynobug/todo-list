import { Database } from "./Database";
import { IOHandler } from "./IOHandler";
/**
 * Represents a command for the to-do list
 */
export interface Command {
    /**
     * Runs the command
     * @param input User input from the command box
     * @param handler The IO handler to send output to
     * @param db The database to interact with
     * @param date Optional parameter for certain commands
     */
    run(
        input: string,
        handler: IOHandler,
        db: Database,
        date?: string
    ): Promise<void>;
}
