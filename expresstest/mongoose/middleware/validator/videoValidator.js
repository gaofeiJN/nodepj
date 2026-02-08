const { query, body, param } = require("express-validator");
const validate = require("./errorBack");
const { Video, Comment, User } = require("../../model/index");

// 由valid check回调函数组成的数组
exports.postVideoValidate = validate([
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
]);

// 由valid check回调函数组成的数组
exports.getVideoListValidate = validate([
  query("pageNum").optional().isNumeric().withMessage("页码必须是数字").bail(),
  query("pageSize")
    .optional()
    .isNumeric()
    .withMessage("每页显示的视频数量必须是数字")
    .bail(),
  ,
]);

// 由valid check回调函数组成的数组
exports.postCommentValidate = validate([
  body("content")
    .notEmpty()
    .withMessage("评论内容不能为空")
    .bail()
    .isString()
    .withMessage("错误的格式，请输入字符串")
    .bail()
    .isLength({ min: 10, max: 256 })
    .withMessage("评论长度应该在10到256个字符")
    .bail(),
  param("videoId").custom(async (videoId) => {
    try {
      const video = await Video.findById(videoId);
      if (!video) {
        throw new Error("视频不存在");
      }
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }),
]);

// 由valid check回调函数组成的数组
exports.getCommentsValidate = validate([
  param("videoId").custom(async (videoId) => {
    try {
      const video = await Video.findById(videoId);
      if (!video) {
        throw new Error("视频不存在");
      }
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }),
]);

// 由valid check回调函数组成的数组
exports.deleteCommentValidate = validate([
  param("videoId").custom(async (videoId) => {
    try {
      const video = await Video.findById(videoId);
      if (!video) {
        throw new Error("视频不存在");
      }
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }),
  param("commentId").custom(async (commentId) => {
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        throw new Error("评论不存在");
      }
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }),
]);

// 由valid check回调函数组成的数组
exports.getVideoApprovalsValidate = validate([
  param("videoId").custom(async (videoId) => {
    try {
      const video = await Video.findById(videoId);
      if (!video) {
        throw new Error("视频不存在");
      }
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }),
]);

// 由valid check回调函数组成的数组
exports.getVideoFavoritesValidate = validate([
  param("videoId").custom(async (videoId) => {
    try {
      const video = await Video.findById(videoId);
      if (!video) {
        throw new Error("视频不存在");
      }
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }),
  param("folder")
    .optional()
    .isString()
    .withMessage("收藏夹必须是字符串")
    .bail()
    .isLength({ min: 1, max: 20 })
    .withMessage("收藏夹的长度必须在1到20个字符之间")
    .bail()
    .custom(async (folder) => {
      const allowedPattern = /^[\w\p{Script=Han}]{1,20}$/u;
      if (!allowedPattern.test(folder)) {
        throw new Error("非法的收藏夹名称");
      }
      return true;
    }),
]);
