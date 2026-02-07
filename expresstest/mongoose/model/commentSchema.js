const mongoose = require("mongoose");

// 定义Schema
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "评论内容不能为空"],
      minlength: [10, "评论至少10个字符"],
      maxlength: [256, "评论最多256个字符"],
    },
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
    approvalCount: {
      type: Number,
      required: false,
    },
    approvals: {
      type: [mongoose.ObjectId],
      required: false,
    },
    objectionCount: {
      type: Number,
      required: false,
    },
    objections: {
      type: [mongoose.ObjectId],
      required: false,
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

commentSchema.index({ videoId: 1, createdAt: -1 }); // 降序索引

// 导出模型
module.exports = commentSchema;
