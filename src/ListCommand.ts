import { Command } from "./Command";
import { Database } from "./Database";
import { IOHandler } from "./IOHandler";
import { Task } from "./Task";
/**
 * Outputs all tasks to the to-do list, optionally filtering by keyword
 */
export class ListCommand implements Command {
    static readonly COMMAND_WORD: string = "list";
    async run(input: string, handler: IOHandler, db: Database): Promise<void> {
        let tasksStr = "";
        const args: string[] = input.split(" ");
        const archive: boolean = args[0] === "ARCHIVE";
        const tag: boolean = args[0] === "TAG";
        const prio: boolean = args[0] === "PRIO";
        let maxNum: number;
        let minNum: number;
        if (args[2] == "+") {
            maxNum = Number.MAX_VALUE;
            minNum = parseInt(args[1]);
        } else if (args[2] == "-") {
            minNum = Number.MIN_VALUE;
            maxNum = parseInt(args[1]);
        }
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
        if (prio) {
            taskArr.map((task) => {
                if (
                    task.getPriority() <= maxNum &&
                    task.getPriority() >= minNum
                ) {
                    tasksStr += task.toString();
                }
            });
        }
        if (!tag && !archive && !prio) {
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
        await handler.output(tasksStr);
        handler.end;
    }
}
