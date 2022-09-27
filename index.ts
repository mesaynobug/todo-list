import { createServer, IncomingMessage, ServerResponse } from "http";
let tasks: String[] = [];
createServer(function (req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(
    `<form action="" method="post">
            <input type="text" id="textBox" name=textBox>
            <button>Hello!</button>
            </form>`
  );

  if (req.method == "POST") {
    let data: string = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
    let usp: URLSearchParams = new URLSearchParams(data);
        tasks.push(usp.get("textBox")!);
    });
  }
  for (let element in tasks){console.log(tasks[element]);}
  res.end();
}).listen(3000);
