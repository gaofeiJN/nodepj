const express = require("express");

const app = express();
const port = process.env.port || 3000;

const cors = require("cors");

const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const router = require("./router");

// 中间件
app.use(express.json());
// app.use(express.urlencoded());

// 跨域
app.use(cors());

// 日志
const logDirectory = path.join(__dirname, "logs", "access-log.txt");
const accessLogStream = fs.WriteStream(logDirectory, { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));

// 挂载路由
app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
