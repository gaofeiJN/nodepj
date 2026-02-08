const { Video, Comment, Approval, Favor } = require("../model/index");
const mongoose = require("mongoose");

// 获取VOD上传权限
exports.getCreateUploadVideoAuth = async (req, res) => {
  console.log("videoController -- getCreateUploadVideoAuth called");

  // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
  res.status(200).json(req.alires);
};

// 更新VOD上传权限
exports.getRefreshUploadVideoAuth = async (req, res) => {
  console.log("videoController -- getRefreshUploadVideoAuth called");

  // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
  res.status(200).json(req.alires);
};
