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
      select: false,

      // 使用set函数在保存用户时自动加密密码
      // 注意：这里使用同步方法以确保在保存前密码已加密
      // 注意：最好在保存前的钩子函数中处理 （1）可以异步加密 （2）可以避免在Schema中设置select: false时的复杂性
      // set: function (password) {
      //   try {
      //     const saltRounds = bcrypt.genSaltSync(10);
      //     return bcrypt.hashSync(password, saltRounds);
      //   } catch (err) {
      //     console.error("Error hashing password:", err);
      //     return password; // 返回原始密码，避免阻塞用户创建
      //   }
      // },
    },
    phone: { type: String, required: true, unique: true },
    age: { type: Number, required: false },
    city: { type: String, required: false },
    image: { type: String, default: null },
  },
  { timestamps: true }, // 自动添加createdAt和updatedAt字段
);

// 定义保存前的钩子函数，用于加密密码
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    let saltRounds = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
  } catch (error) {
    return next(error);
  }
});

// 定义实例方法，用于比较密码
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 定义实例方法，用于比较密码（同步版）
userSchema.methods.comparePasswordSync = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

// 导出模型
module.exports = userSchema;
