const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// 将jst.sign()和jwt.verify()转换为Promise
const { promisify } = require("util");
const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

const util = require("util");

exports.createToken = async function (userInfo) {
  return await sign(userInfo, JWT_SECRET, { expiresIn: 60 * 60 * 24 });
};

// 验证token的方法做成中间件
// token在请求头的autorization字段里面 { authorization : "Bearer " + token }
exports.verifyToken = async function (req, res, next) {
  // 1.请求头中没有Authorization : null
  // 2.请求头中有Authorization，但不是Bearer模式 ： ''
  // 3.请求头中有Authorization，且为Bearer模式 ： token
  let token = req.headers.authorization;
  token = token ? token.split("Bearer ")[1] : null;
  if (!token) {
    res.status(402).json({ error: "请传入token" });
  }
  try {
    req.userInfo = await verify(token, JWT_SECRET);
    console.log(`req.userInfo : \n ${util.inspect(req.userInfo)}`);

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
