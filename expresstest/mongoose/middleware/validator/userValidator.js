const { body } = require("express-validator");
const validate = require("./errorBack");
const { User } = require("../../model/index");

// 由valid check回调函数组成的数组
const register = validate([
  body("name")
    .notEmpty()
    .withMessage("用户名不能为空")
    .bail()
    .isString()
    .withMessage("用户名必须是字符串")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("用户名长度必须在3到30个字符之间")
    .custom(async (value) => {
      const existingUser = await User.findOne({ name: value });
      if (existingUser) {
        return Promise.reject("用户名已被注册");
      }
    })
    .bail(),
  body("email")
    .notEmpty()
    .withMessage("电子邮件不能为空")
    .bail()
    .isEmail()
    .withMessage("电子邮件格式不正确")
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        return Promise.reject("邮箱已被注册");
      }
    })
    .bail(),
  body("phone")
    .notEmpty()
    .withMessage("电话号码不能为空")
    .bail()
    .isNumeric()
    .withMessage("电话号码格式不正确")
    .custom(async (value) => {
      const existingUser = await User.findOne({ phone: value });
      if (existingUser) {
        return Promise.reject("电话号码已被注册");
      }
    })
    .bail(),
  body("password")
    .notEmpty()
    .withMessage("密码不能为空")
    .bail()
    .isLength({ min: 6 })
    .withMessage("密码长度至少为6个字符")
    .bail(),
]);

// 由valid check回调函数组成的数组
const login = validate([
  body("email")
    .notEmpty()
    .withMessage("电子邮件不能为空")
    .bail()
    .isEmail()
    .withMessage("电子邮件格式不正确"),
  body("password")
    .notEmpty()
    .withMessage("密码不能为空")
    .bail()
    .isLength({ min: 6 })
    .withMessage("密码长度至少为6个字符")
    .bail(),
]);

const userValidator = { register, login };
module.exports = userValidator;
