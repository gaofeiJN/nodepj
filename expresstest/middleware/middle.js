const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const router = require("./router");

// 错误处理中间件函数的使用
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// 挂载路由中间件
app.use("/router", router);

// 应用程序级别的中间件函数的使用
app.use((req, res, next) => {
  console.log(
    `Request Method: ${req.method}, Request URL: ${req.url} , Time: ${new Date().toString()}`,
  );
  next();
});

// 应用程序级别的中间件函数:在某个特定的method下使用中间件函数
app.get(
  "/",
  (req, res, next) => {
    console.log(`This is a get method`);
    next();
  },
  (req, res) => {
    res.send("This is middleware test page");
  },
);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
