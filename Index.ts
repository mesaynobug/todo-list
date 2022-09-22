let http = require('http');
http.createServer(
    function(req:any, res:any){
        res.write('Hello World');
        res.end();
    })
    .listen(3000);