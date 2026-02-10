const mongoose = require("mongoose");

// 定义Schema
const subscribeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.ObjectId,
      required: [true, "用户id不能为空"],
      ref: "User",
    },
    channel: {
      type: mongoose.ObjectId,
      required: [true, "频道id不能为空"],
      ref: "User",
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

subscribeSchema.index({ user: 1, channel: 1 }); // 升序索引

// 导出模型
module.exports = subscribeSchema;
