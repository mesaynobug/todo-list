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
        const args: string[] = input.split(" ");
        const archive: boolean = args[0] === "ARCHIVE";
        const tag: boolean = args[0] === "TAG";
        const idArr: number[] = await db.list();
        const taskArr: Task[] = await Promise.all(
            idArr.map((id) => db.read(id))
        );

        if (archive) {
            taskArr.map((task) => {
                if (task.getArchived()) {
                    tasksStr += task.toString();
                }
            });
        }
        if (tag) {
            taskArr.map((task) => {
                if (task.getTags().find((e) => e == args[1])) {
                    tasksStr += task.toString();
                }
            });
        }
        if (!tag && !archive) {
            taskArr.map((task) => {
                if (
                    (task.getDesc().search(input) !== -1 ||
                        input.trim() === "") &&
                    !task.getArchived()
                ) {
                    tasksStr += task.toString();
                }
            });
        }
        res.write(tasksStr);
        res.end();
    }
}
