const mongoose = require("mongoose");

// 定义Schema
const favorSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.ObjectId,
      required: [true, "videoId不能为空"],
      ref: "Video",
    },
    userId: {
      type: mongoose.ObjectId,
      required: [true, "userId不能为空"],
      ref: "User",
    },
    folder: {
      type: String,
      required: false,
      default: "默认收藏夹",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      getters: true,
      transform: function (doc, ret) {
        // 删除不需要返回的字段
        delete ret.password;

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
        delete ret.password;

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
  }, // 自动添加createdAt和updatedAt字段
);

// ====================
// 索引优化
// ====================

favorSchema.index({ userId: 1, folder: 1, createdAt: -1 });

// 导出模型
module.exports = favorSchema;
