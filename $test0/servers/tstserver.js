//加载http模块
var http = require('http');

console.log("打开浏览器，输入网址 http://127.0.0.1:8080")

http.createServer(function(request, response) {
    console.log(request.url);
    console.log(request);
    response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    response.end('GF Host');

}).listen(8080,'127.0.0.1');
