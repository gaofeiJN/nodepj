const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // 引入bcrypt库用于密码加密

// 定义Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      set: function (password) {
        try {
          const saltRounds = bcrypt.genSaltSync(10);
          return bcrypt.hashSync(password, saltRounds);
        } catch (err) {
          console.error("Error hashing password:", err);
          return password; // 返回原始密码，避免阻塞用户创建
        }
      },
    },
    phone: { type: String, required: true, unique: true },
    age: { type: Number, required: false },
    city: { type: String, required: false },
    image: { type: String, default: null },
  },
  { timestamps: true }, // 自动添加createdAt和updatedAt字段
);

// 导出模型
module.exports = userSchema;
