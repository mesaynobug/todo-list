import { createServer, IncomingMessage, ServerResponse } from "http";
let tasks: String[] = [];
let tasksStr: string = "";
let myForm: string = `<form action="" method="post">
                      <input type="text" id="textBox" name=textBox autofocus="autofocus">
                      <button type="submit">Hello!</button>
                      </form>`;
createServer(function (req: IncomingMessage, res: ServerResponse) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(myForm);
    tasksStr = "";
    if (req.method == "POST") {
        let data: string = "";
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", () => {
            let usp: URLSearchParams = new URLSearchParams(data);
            if (usp.get("textBox") != "") {
                tasks.push(usp.get("textBox")!);
            }
            for (let element in tasks) {
                tasksStr += tasks[element] + "<br>";
            }
            res.write(tasksStr);
            res.end();
        });
    }
    else{
        for (let element in tasks) {
            tasksStr += tasks[element] + "<br>";
        }
        res.write(tasksStr);
        res.end();}
}).listen(3000);
