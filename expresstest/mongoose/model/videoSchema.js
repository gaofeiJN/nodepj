const mongoose = require("mongoose");

// 定义Schema
const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: false },
    user: { type: mongoose.ObjectId, required: true, ref: "User" },
    approvalCount: {
      type: Number,
      required: false,
      default: 0,
    },
    favorCount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
      transform: function (doc, ret) {
        // 删除不需要返回的字段

        // 格式化日期字段
        if (ret.createdAt) {
          ret.createdAt = ret.createdAt.toISOString();
        }
        if (ret.updatedAt) {
          ret.updatedAt = ret.updatedAt.toISOString();
        }

        // 返回修改后的对象
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      getters: true,
      transform: function (doc, ret) {
        // 删除不需要返回的字段

        // 格式化日期字段
        if (ret.createdAt) {
          ret.createdAt = ret.createdAt.toISOString();
        }
        if (ret.updatedAt) {
          ret.updatedAt = ret.updatedAt.toISOString();
        }

        // 返回修改后的对象
        return ret;
      },
    },
  },
);

// index
videoSchema.index({ createdAt: -1 });
videoSchema.index({ updatedAt: -1 });

// 导出模型
module.exports = videoSchema;
