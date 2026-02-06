const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // 引入bcrypt库用于密码加密

// 定义Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "用户名不能为空"],
      trim: true,
      minlength: [3, "用户名至少3个字符"],
      maxlength: [30, "用户名最多30个字符"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "邮箱不能为空"],
      lowercase: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "请输入有效的邮箱地址"],
    },
    password: {
      type: String,
      required: [true, "密码不能为空"],
      minlength: [6, "密码至少6个字符"],
      select: false, // 默认不返回密码字段

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
    passwordChangedAt: Date, // 记录密码修改时间
    passwordResetToken: String,
    passwordResetExpires: Date,
    phone: {
      type: String,
      required: [true, "手机号不能为空"],
      unique: true,
      match: [/^(\+86)?\d{11}$/, "请输入有效的手机号"],
    },
    age: { type: Number, required: false },
    city: { type: String, required: false },
    image: { type: String, default: null },
    cover: { type: String, default: null },
    channelId: {
      type: mongoose.ObjectId,
      set: function (value) {
        return this._id;
      },
    },
    channelDescription: { type: String, default: null },
    subscribeCount: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
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
// 钩子函数 (Hooks)
// ====================

// ====================
// 在新版本的mongoose中，钩子应该被视为返回Promise的异步函数，而不是接收next回调的函数
// 钩子函数不需要手动调用next()，mongoose会自动处理
// 但是在异步钩子中必须使用done()或者返回Promise
// 异常处理：抛出异常或者在异步钩子中向done(err)传递错误
// ====================

// 1.保存前的钩子函数，用于加密密码
userSchema.pre("save", async function () {
  // 不再定义next参数
  if (!this.isModified("password")) return; //直接return，不调用next()
  try {
    let saltRounds = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    //完成，不调用next()
  } catch (error) {
    throw error; // 直接抛出error
  }
});

// 2.更新密码时记录修改时间
userSchema.pre("save", async function () {
  if (!this.isModified("password") || this.isNew) return;

  // 密码修改时间设置为当前时间减去1秒（确保token在密码修改后创建）
  this.passwordChangedAt = Date.now() - 1000;
});

// 3. 查询钩子 - 只查询 active 为 true 的用户
// userSchema.pre(/^find/, async function () {
//   // this 指向当前查询
//   this.find({ active: { $ne: false } });
// });

// 4. 保存后的钩子 - 日志记录
// If your post hook function takes at least 2 parameters,
// mongoose will assume the second parameter is a next() function that
// you will call to trigger the next middleware in the sequence.
userSchema.post("save", async function (doc) {
  console.log(`用户 ${doc.name} 已保存到数据库`);
});

// 5. 删除前的钩子 - 清理相关数据
// userSchema.pre("remove", async function (next) {
//   // 假设需要清理用户的文章、评论等
//   await mongoose.model("Post").deleteMany({ author: this._id });
//   await mongoose.model("Comment").deleteMany({ user: this._id });
//   next();
// });

// ====================
// 实例方法 (Instance Methods)
// ====================
// 定义实例方法，用于比较密码
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 定义实例方法，用于比较密码（同步版）
userSchema.methods.comparePasswordSync = function (candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

// 验证密码强度（自定义验证）
userSchema.methods.validatePasswordStrength = function (password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) errors.push("至少8个字符");
  if (!hasUpperCase) errors.push("至少一个大写字母");
  if (!hasLowerCase) errors.push("至少一个小写字母");
  if (!hasNumbers) errors.push("至少一个数字");
  if (!hasSpecialChars) errors.push("至少一个特殊字符");

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ====================
// 静态方法 (Static Methods)
// ====================

// 1. 根据邮箱查找用户（包含密码）
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).select("+password");
};

// 2. 根据用户名查找用户（包含密码）
userSchema.statics.findByUsername = function (name) {
  return this.findOne({ name }).select("+password");
};

// 3. 批量更新用户角色
userSchema.statics.updateUserRoles = async function (emails, role) {
  return this.updateMany({ email: { $in: emails } }, { $set: { role } });
};

// 4. 统计活跃用户
userSchema.statics.countActiveUsers = function () {
  return this.countDocuments({ active: true });
};

// ====================
// 查询助手 (Query Helpers)
// ====================

// 1. 按角色查询
userSchema.query.byRole = function (role) {
  return this.where({ role });
};

// 2. 按注册时间范围查询
userSchema.query.byRegistrationDate = function (startDate, endDate) {
  return this.where({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  });
};

// 3. 按用户名关键词查询
userSchema.query.byNameKeyword = function (keyword) {
  return this.where({
    name: new RegExp(keyword, "i"),
  });
};

// ====================
// 索引优化
// ====================

// userSchema.index({ name: 1 }); // 升序索引
// userSchema.index({ email: 1 }); // 升序索引

// 导出模型
module.exports = userSchema;
