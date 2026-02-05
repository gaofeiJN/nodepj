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
    .bail()
    .custom(async (value) => {
      try {
        const existingUser = await User.findOne({ name: value });
        if (existingUser) {
          throw new Error("用户名已被注册");
        }
        return true;
      } catch (error) {
        throw error;
      }
    }),
  body("email")
    .notEmpty()
    .withMessage("电子邮件不能为空")
    .bail()
    .isEmail()
    .withMessage("电子邮件格式不正确")
    .bail()
    .custom(async (value) => {
      try {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          throw new Error("邮箱已被注册");
        }
        return true;
      } catch (error) {
        throw error;
      }
    }),
  body("phone")
    .notEmpty()
    .withMessage("电话号码不能为空")
    .bail()
    .isNumeric()
    .withMessage("电话号码格式不正确")
    .bail()
    .custom(async (value) => {
      try {
        const existingUser = await User.findOne({ phone: value });
        if (existingUser) {
          throw new Error("电话号码已被注册");
        }
        return true;
      } catch (error) {
        throw error;
      }
    }),
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
  body("name")
    .optional()
    .isString()
    .withMessage("用户名必须是字符串")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("用户名长度必须在3到30个字符之间")
    .bail()
    .custom(async (value) => {
      try {
        const existingUser = await User.findOne({ name: value });
        if (!existingUser) {
          throw new Error("用户名未注册");
        }
        return true;
      } catch (error) {
        throw error;
      }
    }),
  body("email")
    .optional()
    .isEmail()
    .withMessage("电子邮件格式不正确")
    .bail()
    .custom(async (value) => {
      try {
        const existingUser = await User.findOne({ email: value });
        if (!existingUser) {
          throw new Error("邮箱未注册");
        }
        return true;
      } catch (error) {
        throw error;
      }
    }),
  body("phone")
    .optional()
    .isNumeric()
    .withMessage("电话号码格式不正确")
    .bail()
    .custom(async (value) => {
      try {
        const existingUser = await User.findOne({ phone: value });
        if (!existingUser) {
          throw new Error("电话号码未注册");
        }
        return true;
      } catch (error) {
        throw error;
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("密码不能为空")
    .bail()
    .isLength({ min: 6 })
    .withMessage("密码长度至少为6个字符")
    .bail(),
  body().custom(async (value, { req }) => {
    let { name, phone, email } = req.body;
    if (!name && !phone && !email) {
      throw new Error("请输入用户名/电话号码/邮箱");
    }
    return true;
  }),
]);

// 由valid check回调函数组成的数组
const update = validate([
  body("name")
    .optional()
    .notEmpty()
    .withMessage("用户名不能为空")
    .bail()
    .isString()
    .withMessage("用户名必须是字符串")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("用户名长度必须在3到30个字符之间")
    .bail()
    .custom(async (value) => {
      try {
        const existingUser = await User.findOne({ name: value });
        if (existingUser) {
          throw new Error("用户名已被注册");
        }
        return true;
      } catch (error) {
        throw error;
      }
    }),
  body("email")
    .optional()
    .notEmpty()
    .withMessage("电子邮件不能为空")
    .bail()
    .isEmail()
    .withMessage("电子邮件格式不正确")
    .bail()
    .custom(async (value) => {
      try {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          throw new Error("邮箱已被注");
        }
        return true;
      } catch (error) {
        throw error;
      }
    }),
  body("phone")
    .optional()
    .notEmpty()
    .withMessage("电话号码不能为空")
    .bail()
    .isNumeric()
    .withMessage("电话号码格式不正确")
    .bail()
    .custom(async (value) => {
      try {
        const existingUser = await User.findOne({ phone: value });
        if (existingUser) {
          throw new Error("电话号码已被注册");
        }
        return true;
      } catch (error) {
        throw error;
      }
    }),
  body("password")
    .optional()
    .notEmpty()
    .withMessage("密码不能为空")
    .bail()
    .isLength({ min: 6 })
    .withMessage("密码长度至少为6个字符")
    .bail(),
]);

const userValidator = { register, login, update };
module.exports = userValidator;
