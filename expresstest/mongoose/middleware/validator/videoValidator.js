const { query, body } = require("express-validator");
const validate = require("./errorBack");
const { Video } = require("../../model/index");

// 由valid check回调函数组成的数组
const createVideo = validate([
  body("title")
    .notEmpty()
    .withMessage("标题不能为空")
    .bail()
    .isString()
    .withMessage("标题必须是字符串")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("标题长度必须在3到30个字符之间")
    .bail(),
  body("fileName")
    .notEmpty()
    .withMessage("文件名不能为空")
    .bail()
    .isString()
    .withMessage("文件名必须是字符串")
    .bail(),
  body("videoId")
    .notEmpty()
    .withMessage("videoId不能为空")
    .bail()
    .isString()
    .withMessage("videoId必须是字符串")
    .bail()
    .custom(async (value) => {
      try {
        const existingVideo = await Video.findOne({ videoId: value });
        if (existingVideo) {
          throw new Error("videoId已存在");
        }
        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
]);

// 由valid check回调函数组成的数组
const videoList = validate([
  query("pageNum").optional().isNumeric().withMessage("页码必须是数字").bail(),
  query("pageSize")
    .optional()
    .isNumeric()
    .withMessage("每页显示的视频数量必须是数字")
    .bail(),
  ,
]);

const videoValidator = { createVideo, videoList };
module.exports = videoValidator;
