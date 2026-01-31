const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// 将jst.sign()和jwt.verify()转换为Promise
const { promisify } = require("util");
const { log } = require("console");
const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

exports.createToken = async function (userInfo) {
  return await sign(userInfo, JWT_SECRET, { expiresIn: 60 * 60 * 24 });
};

// 验证token的方法做成中间件
// token在请求头的autorization字段里面 { authorization : "Bearer " + token }
exports.verifyToken = async function (req, res, next) {
  // return await verify(token, JWT_SECRET);
  let token = req.headers.authorization;
  token = token ? token.split("Bearer ")[1] : null;
  if (!token) {
    res.status(402).json({ error: "请传入token" });
  }
  try {
    req.user = await verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(402).json({ error: "无效的token" });
  }
};

// var user = {
//     name :'gao fei',
//     age :39,
//     city :'jinan',
//     phone :'15662689645'
// }

// var secret = "f6f6c96b-e006-4d60-9b69-2bc4cb28cae2";

// async function jwtTest(){
//   let token = await sign(user,secret,{algorithm:'HS256'});
//   console.log(token);

//   let result = await verify(token,secret);
//   console.log(result);
// }

// jwtTest();
