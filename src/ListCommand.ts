import { Command } from "./Command";
import { Database } from "./Database";
import { ServerResponse } from "http";
import { Task } from "./Task";
/**
 * Outputs all tasks to the to-do list, optionally filtering by keyword
 */
export class ListCommand implements Command {
    static readonly COMMAND_WORD: string = "list";
    async run(input: string, res: ServerResponse, db: Database): Promise<void> {
        let tasksStr = "";
        const archive: boolean = input === "ARCHIVE";
        const idArr: number[] = await db.list();
        const taskArr: Task[] = await Promise.all(
            idArr.map((id) => db.read(id))
        );
        taskArr.map((task) => {
            if (
                ((task.getDesc().search(input) !== -1 || input.trim() === "") &&
                    !archive &&
                    !task.getArchived()) ||
                (archive && task.getArchived())
            ) {
                tasksStr += task.toString();
            }
        });
        res.write(tasksStr);
        res.end();
    }
}
