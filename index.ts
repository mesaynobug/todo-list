import {createServer, IncomingMessage, ServerResponse} from 'http';

createServer(function (req:IncomingMessage, res:ServerResponse) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write(
        `<form>
        <input type="text" id="textBox">
        <button type="button">Hello!</button>
        </form>`);
    res.end();
}).listen(3000);
