const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// 将jst.sign()和jwt.verify()转换为Promise
const { promisify } = require("util");
const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

exports.createToken = async function (userInfo) {
  return await sign(userInfo, JWT_SECRET, { expiresIn: 60 * 60 * 24 });
};

exports.verifyToken = async function (token) {
  return await verify(token, JWT_SECRET);
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
