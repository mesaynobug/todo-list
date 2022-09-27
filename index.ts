import { createServer, IncomingMessage, ServerResponse } from "http";

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
        console.log(usp.get("textBox"));
      });
    }
    res.end();
}).listen(3000);
