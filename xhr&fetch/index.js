const http = require('http');
const fs = require('fs');
const url = require("node:url");

const server = http.createServer((request, response) => {
    // 主页
    if (request.url === '/') {
        response.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'});
        fs.readFile('./html/index.html', (err, data) => {
            if (err) {
                response.end(`Error: ${err}`);
            } else {
                response.end("Hello World!\n 2026.01.06");
            }
        })
    }

    //
    console.log(request.headers);
    console.log(response);

});
server.listen(8080);