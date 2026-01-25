const mongoose = require("mongoose");

// 定义Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: false },
  city: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
});

// 创建模型
const User = mongoose.model("User", userSchema);

// 导出模型
module.exports = User;
