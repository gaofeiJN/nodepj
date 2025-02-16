//加载http模块
let http = require('http');

console.log("打开浏览器，输入网址 http://127.0.0.1:8080")

http.createServer(function (request, response) {

    switch (request.url) {
        case '/form':
            switch (request.method) {
                case 'post':
                    let fullBody = '';

                    request.on('data', function (data) {
                        fullBody += data.toString();
                    });

                    request.on('end', function () {
                        response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
                        response.write('<html lang="cn"><head><title>Post Data</title></head><body>');
                        response.write('<style>th,td{text-align: left;padding: 5px;color: black}\n');
                        response.write('th {background-color:grey;color:white;min-width:10em}\n');
                        response.write('td {background-color:lightgrey}\n');
                        response.write('caption {font-weight:bold}</style>>');
                        response.write('<table border="thick double #32a1ce"><caption>Form Data</caption>');
                        response.write('<tr><th>Name</th><th>Value</th></tr>');

                        let dbody = querystring.parse(fullBody);
                        for (let prop in dbody) {
                            response.write('<tr><td>' + prop + '</td><td>' + dbody[prop] + '</td></tr>');
                        }

                        response.write('</table></body></html>');
                        response.end();
                    });
                    break;

                default:
                    response.writeHead(405, "Method Not Supported", {'Content-Type': 'text/html;charset=utf-8'});
                    response.end('<html lang="cn"><head><title>Method Not Supported</title></head>' +
                        '<body><h1>Method Not Supported.</h1></body></html>');
            }
            break;

        default:
            response.writeHead(404, "Not Found", {'Content-Type': 'text/html;charset=utf-8'});
            response.end('<html lang="cn"><head><title>404 - Not Found</title></head>' +
                '<body><h1>Not Found.</h1></body></html>');
    }
}).listen(8080, '127.0.0.1');
