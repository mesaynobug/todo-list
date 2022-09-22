import {createServer, IncomingMessage, ServerResponse} from 'http';

createServer(function (req:IncomingMessage, res:ServerResponse) {
    res.write('Hello World');
    res.end();
}).listen(3000);
