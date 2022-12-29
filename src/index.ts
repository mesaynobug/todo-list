import { createServer, IncomingMessage, ServerResponse } from "http";
import moment from "moment";
import { Command } from "./Command";
import { Database } from "./Database";
import { JsonDatabase } from "./JsonDatabase";
import { AddCommand } from "./AddCommand";
import { RemoveCommand } from "./RemoveCommand";
import { ArchiveCommand } from "./ArchiveCommand";
import { UnarchiveCommand } from "./UnarchiveCommand";
import { ListCommand } from "./ListCommand";
import { SortCommand } from "./SortCommand";
import { CompleteCommand } from "./CompleteCommand";
import { IncompleteCommand } from "./IncompleteCommand";
import { PriorityCommand } from "./PriorityCommand";
import { TagCommand } from "./TagCommand";
import { InvalidCommand } from "./InvalidCommand";

const myForm = `<form action="" method="post">
                      <input type="text" id="textBox" name=textBox autofocus="autofocus">
                      Due:      <input type="date" name="date"><input type="time" name="time">
                      <button type="submit">Hello!</button>
                      </form>`;

const myDatabase: Database = new JsonDatabase("Hello.json");

createServer(function (req: IncomingMessage, res: ServerResponse) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(myForm);

    if (req.method === "POST") {
        let data = "";

        req.on("data", (chunk) => {
            data += chunk;
        });

        req.on("end", () => {
            const usp: URLSearchParams = new URLSearchParams(data);
            const time = usp.get("time");
            const date = usp.get("date");
            const timeDate = moment(
                `${date} ${time}`,
                "YYYY-MM-DD HH:mm:ss"
            ).format("MMMM Do YYYY, h:mm a");
            const textbox = usp.get("textBox");
            if (textbox === null) {
                res.write("Textbox is kill");
                return 0;
            }
            let varCommand: string = textbox.substring(0, textbox.indexOf(" "));
            if (textbox.indexOf(" ") == -1) {
                varCommand = textbox;
            }
            const argument: string = textbox.substring(varCommand.length + 1);
            let command: Command;
            switch (varCommand.toLowerCase().trim()) {
                case AddCommand.COMMAND_WORD:
                    command = new AddCommand();
                    break;
                case RemoveCommand.COMMAND_WORD:
                    command = new RemoveCommand();
                    break;
                case ListCommand.COMMAND_WORD:
                    command = new ListCommand();
                    break;
                case SortCommand.COMMAND_WORD:
                    command = new SortCommand();
                    break;
                case CompleteCommand.COMMAND_WORD:
                    command = new CompleteCommand();
                    break;
                case IncompleteCommand.COMMAND_WORD:
                    command = new IncompleteCommand();
                    break;
                case PriorityCommand.COMMAND_WORD:
                    command = new PriorityCommand();
                    break;
                case TagCommand.COMMAND_WORD:
                    command = new TagCommand();
                    break;
                case ArchiveCommand.COMMAND_WORD:
                    command = new ArchiveCommand();
                    break;
                case UnarchiveCommand.COMMAND_WORD:
                    command = new ArchiveCommand();
                    break;
                default:
                    command = new InvalidCommand();
                    break;
            }
            command.run(argument, res, myDatabase, timeDate);
        });
    } else if (req.url !== "/favicon.ico") {
        res.end();
    } else {
        res.end();
    }
}).listen(3000);
