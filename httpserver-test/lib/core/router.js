const fs = require("fs");
const url = require("url");

const router = (req, res) => {
  console.log(req.url);
  // const urlObj = url.parse(req.url, true);
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  console.log(urlObj);
  console.log(decodeURIComponent(urlObj.pathname));

  if (decodeURIComponent(urlObj.pathname) === "/" && req.method === "GET") {
    fs.readFile("../html/index.html", (err, data) => {
      if (err) {
        console.log(err);

        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("服务器错误，无法加载页面");
      } else {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
      }
    });
  }

  if (
    decodeURIComponent(urlObj.pathname) === "/img/狗狗.jpg" &&
    req.method === "GET"
  ) {
    fs.readFile("../img/狗狗.jpg", (err, data) => {
      if (err) {
        console.log(err);

        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("服务器错误，无法加载图片");
      } else {
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(data);
      }
    });
  }
};

module.exports = router;
