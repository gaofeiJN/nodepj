//加载http模块
let http = require('http');
let qs = require('querystring');
let url = require('url');
// let fs = require('fs');

let server = http.createServer(function (req, res) {
    console.log(req.method + ' ' + req.url);
    let obj = {};
    let contentType = req.headers['content-type'];
    let fullData = '';
    console.log('contentType: ' + contentType);

    switch (req.method) {
        case 'GET':
            console.log(url.parse(req.url));

            let {query} = url.parse(req.url);
            obj = qs.parse(query);
            console.log(obj);

            writeResponse(res, obj);
            break;

        case 'POST':
            if (contentType.indexOf('application/json') !== -1) {
                req.on('data', function (data) {
                    fullData += data;
                    console.log(fullData);
                });
                req.on('end', function () {
                    obj = JSON.parse(fullData);
                    console.log(obj);
                    writeResponse(res, obj);
                });
            } else if (contentType.indexOf('application/x-www-form-urlencoded') !== -1) {
                req.on('data', function (data) {
                    fullData += data;
                });
                req.on('end', function () {
                    obj = qs.parse(fullData);
                    console.log(obj);
                    writeResponse(res, obj);
                });
            } else if (contentType.indexOf('multipart/form-data') !== -1) {
                req.on('data', function (data) {
                    fullData += data;
                    console.log(fullData);
                });
                // req.on('end', function () {
                //     obj = JSON.parse(fullData);
                //     console.log(obj);
                //     writeResponse(res, obj);
                // });
            }
            break;

        case 'OPTIONS':
            res.writeHead(200, "OK", {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
                'Access-Control-Allow-Headers': '*'
            });
            res.end();
            break;

        default:
            res.writeHead(405, "Method Not Supported", {'Content-Type': 'text/html;charset=utf-8'});
            res.end('<html lang="cn"><head><title>Method Not Supported</title></head>' +
                '<body><h1>Method Not Supported.</h1></body></html>');
    }

});

server.listen(8080, '127.0.0.1', () => {
    console.log("Server started on port 8080");
});

// 返回完整的html文档
// function writeResponse(res, obj) {
//     let sum = 0;
//     for (i in obj) {
//         sum += Number(obj[i]);
//     }
//
//     res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8', 'Access-Control-Allow-Origin': '*'});
//
//     res.end('<html lang="zh-cn"><head><title>总合</title></head>' +
//         '<body><h1>总合是' + sum + '</h1></body></html>');
//
// }

// 返回html片段
// function writeResponse(res, obj) {
//     let sum = 0;
//     for (i in obj) {
//         sum += Number(obj[i]);
//     }
//
//     res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8', 'Access-Control-Allow-Origin': '*'});
//
//     res.end('总合是<b>' + sum + '</b>' );
//
// }

// 返回JSON
function writeResponse(res, obj) {
    let sum = 0;
    for (i in obj) {
        sum += Number(obj[i]);
    }
    obj.sum = sum;
    let jsons = JSON.stringify(obj);

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8', 'Access-Control-Allow-Origin': '*'});

    res.end(jsons);

}