const express = require("express");
const app = express();
const port = process.env.port || 3000;

// app.get(path,callback)
// path的指定方法
// 1.字符串
// 2.字符串模式
// 3.正则表达式
// 4.数组  包含上面3中格式指定的数组

// 2.字符串模式 -- 花括号 {}
// 花括号内的字符表示可选字符，即可以出现也可以不出现
// app.get("/ab{c}d", (req, res) => {
//   // ?表示c可以出现0次或1次
//   res.send(req.path);
// });

// 2.字符串模式 -- 占位符 : 占位符表示可以匹配任意字符
//  1) 多个占位符
// app.get("/user/:id/name/:name", (req, res) => {
//   res.send(
//     `url : ${req.path} ,User ID: ${req.params.id}, Name: ${req.params.name}`,
//     // url : /user/123/name/gaofei ,User ID: 123, Name: gaofei
//   );
// // });

// //  2) 可选占位符
// app.get("/user{/:id}", (req, res) => {
//   res.send(
//     `url : ${req.path} ,User ID: ${req.params.id}`,
//     // url : /user/123 ,User ID: 123
//     // url : /user/ ,User ID: undefined
//   );
// });

//  3) 占位符
// app.get("/user/:id", (req, res) => {
//   res.send(
//     `url : ${req.path} ,User ID: ${req.params.id}`,
//     // url : /user/123 ,User ID: 123
//     // Cannot GET /user/12345/name
//     // Cannot GET /user
//   );
// });

//  4) 通配符 *
// app.get("/user/*splat", (req, res) => {
//   res.send(
//     `url : ${req.path} ,splat: ${req.params.splat}`,
//     // url : /user/12345/name ,splat: 12345,name
//     // url : /user/12345/ ,splat: 12345,
//     // url : /user/12345 ,splat: 12345
//     // Cannot GET /user
//   );
// });

// 3.正则模式 -- 圆括号 ()
// 圆括号内的字符表示一个分组，可以指定出现的次数
// app.get(/\/ab(cde)?f/, (req, res) => {
//   // ?表示cde可以出现0次或1次
//   res.send(req.path);
// });

// 4. 数组
app.get(
  ["/admin", "/user/*user", "/version/ab{c}d", /\/video\/video[0-9]/],
  (req, res) => {
    res.send(
      `url : ${req.path} ,user: ${req.params.user}`,
      // url : /admin ,user: undefined
      // Cannot GET /user/
      // url : /user/gf/jinan/39 ,user: gf,jinan,39
      // url : /version/abcd ,user: undefined
      // url : /version/abd ,user: undefined
      // Cannot GET /version/ab
      // Cannot GET /video/video
      // url : /video/video0 ,user: undefined
      // url : /video/video00056 ,user: undefined
    );
  },
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
