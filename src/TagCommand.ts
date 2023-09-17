import { Command } from "./Command";
import { Database } from "./Database";
import { ServerResponse } from "http";
export class TagCommand implements Command {
    static readonly COMMAND_WORD: string = "tag";
    async run(input: string, res: ServerResponse, db: Database): Promise<void> {
        const arrInput = input.split(" ");
        if (
            arrInput[0] === "add" &&
            (await db.read(Number.parseInt(arrInput[1]))).getId() !== -1
        ) {
            const success: number = await db.addTag(
                Number.parseInt(arrInput[1]),
                arrInput[2]
            );
            if (success === 1 && res != null) {
                res.write(
                    arrInput[2] + " added to tags of task " + arrInput[0] + "."
                );
            } else {
                if (res != null) res.write("Tag already exists.");
            }
        } else if (
            arrInput[0] === "remove" &&
            (await db.read(Number.parseInt(arrInput[1]))).getId() !== -1
        ) {
            const success: number = await db.removeTag(
                Number.parseInt(arrInput[1]),
                arrInput[2]
            );
            if (success === 1 && res != null) {
                res.write(
                    arrInput[2] +
                        " removed from tags of task " +
                        arrInput[0] +
                        "."
                );
            } else {
                if (res != null) res.write("Tag does not exist.");
            }
        }
    }
}
