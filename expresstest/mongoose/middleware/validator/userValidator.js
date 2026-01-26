const { body } = require("express-validator");
const validate = require("./errorBack");

// 由valid check回调函数组成的数组
const userRegisterValidator = validate([
  body("name")
    .notEmpty()
    .withMessage("用户名不能为空")
    .bail()
    .isString()
    .withMessage("用户名必须是字符串")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("用户名长度必须在3到30个字符之间"),
  body("email")
    .notEmpty()
    .withMessage("电子邮件不能为空")
    .bail()
    .isEmail()
    .withMessage("电子邮件格式不正确"),
  body("phone")
    .notEmpty()
    .withMessage("电话号码不能为空")
    .bail()
    .isMobilePhone()
    .withMessage("电话号码格式不正确"),
]);

module.exports = { userRegisterValidator };
