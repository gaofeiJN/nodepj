// 加载模块
const http = require('http');
const fs = require('fs');

// 创建服务器
const server = http.createServer((req, res) => {
    console.log('---request received----------');
    console.log(req.headers);

    // index
    if (req.url === '/') {
        fs.readFile('./html/index.html', (err, data) => {
            if (err) {
                console.log("error reading html file");
            } else {
                let user01 = {
                    name: "gao fei",
                    age: 37,
                    city: 'jinan'
                }
                let userString = JSON.stringify(user01);
                res.writeHead(200, {'Content-Type': 'text/html', 'Set-Cookie': `user01=${userString}`});
                res.end(data);
            }
        });
    }

    // cookie
    if (req.url === '/cookie/') {
        // 响应
        fs.readFile('./html/cookie.html', (err, data) => {
            if (err) {
                console.log("error reading html file");
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    }

    // session
    if (req.url === '/session/') {
        fs.readFile('./html/session.html', (err, data) => {
            if (err) {
                console.log("error reading html file");
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    }

    // local
    if (req.url === '/local/') {
        fs.readFile('./html/local.html', (err, data) => {
            if (err) {
                console.log("error reading html file");
            } else {
                res.writeHead(200, {'Content-Type': 'text/html', 'url': 'http://localhost:8080/local/'});
                res.end(data);
            }
        });
    }
});
server.listen(8080);
console.log("Server started on port 8080");