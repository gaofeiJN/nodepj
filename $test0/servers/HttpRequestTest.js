//加载http模块
let http = require('http');
let fs = require('fs');

// console.log("打开浏览器，输入网址 http://127.0.0.1:8080")

http.createServer(function (request, response) {
    console.log(request.url);
    console.log(request.headers);
    console.log(request);

    switch (request.url) {
        case '/index.html':
            fs.readFile('../html/index.html', function (err, data) {
                if (err) {
                    response.writeHead(500);
                    response.end("Server Error");
                } else {
                    response.writeHead(200);
                    response.end(data);
                }
            });
            break;

        case '/page0.html':
            // response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            response.statusco = 200;
            response.setHeader('Content-Type', 'text/html; charset=utf-8');

            response.end('<html lang="cn"><head><title>Page0</title></head>' +
                '<body><h1>我是page0</h1></body></html>');
            break;

        case '/page1.html':
            response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            response.end('<html lang="cn"><head><title>Page1</title></head>' +
                '<body><h1>我是page1</h1></body></html>');
            break;

        case '/page2.html':
            response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            response.end('<html lang="cn"><head><title>Page2</title></head>' +
                '<body><h1>我不是page2</h1></body></html>');
            break;

        default:
            response.writeHead(404, "Not Found", {'Content-Type': 'text/html;charset=utf-8'});
            response.end('<html lang="cn"><head><title>404 - Not Found</title></head>' +
                '<body><h1>Not Found.</h1></body></html>');
    }

}).listen(8080, '127.0.0.1');
console.log('Server started on http://127.0.0.1:8080');