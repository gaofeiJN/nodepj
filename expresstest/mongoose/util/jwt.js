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

// 验证token的方法做成中间件工厂函数，通过向函数传递参数，从而控制中间件的行为
// token在请求头的autorization字段里面 { authorization : "Bearer " + token }
exports.verifyToken = function (verificationRequired = true) {
  return async function (req, res, next) {
    // 1.请求头中没有Authorization : null
    // 2.请求头中有Authorization，但不是Bearer模式 ： ''
    // 3.请求头中有Authorization，且为Bearer模式 ： token
    let token = req.headers.authorization;
    token = token ? token.split("Bearer ")[1] : null;
    if (token) {
      try {
        req.userInfo = await verify(token, JWT_SECRET);
        console.log(`req.userInfo : \n ${util.inspect(req.userInfo)}`);

        next();
      } catch (e) {
        // 401  Unauthorized  请求需要身份认证（如用户名或密码缺失或错误）
        return res.status(401).json({ error: "无效的token" });
      }
    } else {
      if (verificationRequired) {
        // 401  Unauthorized  请求需要身份认证（如用户名或密码缺失或错误）
        return res.status(401).json({ error: "请传入token" });
      } else {
        next();
      }
    }
  };
};
