const { User } = require("../model/index");
const bcrypt = require("bcrypt");

// 注册新用户
exports.register = async (req, res) => {
  console.log("UserController -- register called");
  console.log(req.body);

  let newUser = new User(req.body);
  try {
    await newUser.save();
    console.log(`User created : ${newUser}`);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).send("Error creating user");
  }
};

// 用户登录
exports.login = async (req, res) => {
  console.log("UserController -- login called");
  const { email, password } = req.body;

  try {
    // 【注】如果在Schema中将password字段设置为select: false，则需要在查询时显式选择它
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).send("未找到该用户");
    }
    console.log(user);

    // 比较密码
    if (!user.comparePasswordSync(password)) {
      return res.status(401).send("密码错误");
    }

    // 登录成功，返回用户信息（不包含密码）
    // 如果在Schema中设置了set,这里对password进行赋值undefined会调用set的回调，
    // 导致报错 【Error: data and salt arguments required】
    user.password = undefined; // 将password字段设为undefined

    console.log(`User logged in : ${user}`);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).send("Error logging in user");
  }
};

exports.listUsers = async (req, res) => {
  console.log("UserController -- listUsers called");
  res.send("List of users");
};

exports.getUser = async (req, res) => {
  const userId = req.params.id;
  console.log(`UserController -- getUser called with ID: ${userId}`);
  res.send(`User details for user ID: ${userId}`);
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  console.log(`UserController -- updateUser called with ID: ${userId}`);
  res.send(`User updated for user ID: ${userId}`);
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  console.log(`UserController -- deleteUser called with ID: ${userId}`);
  res.send(`User deleted for user ID: ${userId}`);
};
