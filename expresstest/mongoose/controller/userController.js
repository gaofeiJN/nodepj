const { User, Subscribe } = require("../model/index");
const { createToken } = require("../util/jwt");

// 注册新用户
exports.register = async (req, res) => {
  console.log("UserController -- register called");
  console.log(req.body);

  let newUser = new User(req.body);
  try {
    await newUser.save();
    console.log(`User created : ${newUser}`);
    // res.status(201).json(newUser.toJSON()); //res.json()方法会调用newUser.toJSON()
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({ error: "Error creating user" });
  }
};

// 用户登录
exports.login = async (req, res) => {
  console.log("UserController -- login called");
  const { name, phone, email, password } = req.body;
  var user = {};
  console.log(name, phone, email, password);

  try {
    if (name) {
      // 【注】如果在Schema中将password字段设置为select: false，则需要在查询时显式选择它
      user = await User.findOne({ name }).select("+password");
    }
    if (phone) {
      // 【注】如果在Schema中将password字段设置为select: false，则需要在查询时显式选择它
      user = await User.findOne({ phone }).select("+password");
    }
    if (email) {
      // 【注】如果在Schema中将password字段设置为select: false，则需要在查询时显式选择它
      user = await User.findOne({ email }).select("+password");
    }
    if (!user) {
      return res.status(404).json({ error: "未找到该用户" });
    }
    console.log(user);

    // 比较密码
    if (!user.comparePasswordSync(password)) {
      return res.status(401).json({ error: "密码错误" });
    }

    // 登录成功，返回用户信息（不包含密码）
    // 如果在Schema中设置了set,这里对password进行赋值undefined会调用set的回调，
    // 导致报错 【Error: data and salt arguments required】
    // user.password = undefined; // 将password字段设为undefined
    let userJSON = user.toJSON(); // 调用toJSON方法
    console.log(`User logged in : ${user}`);

    // 生成token
    let token = await createToken(userJSON);
    userJSON.token = token;

    // 返回给客户端
    res.status(200).json(userJSON);
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Error logging in user" });
  }
};

exports.listUsers = async (req, res) => {
  console.log("UserController -- listUsers called");
};

exports.getUser = async (req, res) => {
  console.log(`UserController -- getUser called`);
};

exports.update = async (req, res) => {
  console.log(`UserController -- update called`);

  try {
    if (!req.userInfo || !req.userInfo._id) {
      return res.status(400).json({ error: "Missing user id" });
    }
    let newuser = await User.findByIdAndUpdate(req.userInfo._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!newuser) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(newuser);
    res.status(200).json(newuser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error updating user" });
  }
};

exports.deleteUser = async (req, res) => {
  console.log(`UserController -- deleteUser called`);
};

exports.avatar = async (req, res) => {
  console.log(`UserController -- avatar called`);

  // console.log(req.file);
  // 更新用户的头像信息
  let avatar = "avatars/" + req.file.filename;
  try {
    let newuser = await User.findByIdAndUpdate(
      req.userInfo._id,
      { image: avatar },
      { new: true },
    );
    if (!newuser) {
      return res.status(401).json({ error: "用户不存在" });
    }

    let userJSON = newuser.toJSON();
    console.log(`用户头像更改成功 \n ${userJSON}`);
    res.status(200).json({ avatar: userJSON.image });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ error: "用户头像更改失败" });
  }
};

exports.subscribe = async (req, res) => {
  console.log(`UserController -- subscribe called`);

  const userId = req.userInfo.id;
  const channelId = req.params.channelId;

  // 检查userId与channelId是否相等
  if (userId === channelId) {
    return res.status(401).json({ error: "不能关注自己" });
  }

  // 检查是否已关注频道
  try {
    const subscribed = await Subscribe.findOne({ userId, channelId });
    if (subscribed) {
      return res.status(401).json({ error: "已关注此频道" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(501)
      .json({ error: "错误：无法从数据库获取关注频道的信息" });
  }

  // 订阅频道入库
  let newSubscribe = new Subscribe({ userId, channelId });
  try {
    let dbback = await newSubscribe.save();
    console.log(dbback);

    let user = await User.findById(channelId);
    user.subscribeCount++;
    user = await user.save();
    console.log(user);

    res.status(200).json({ msg: "订阅成功" });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ error: "订阅失败" });
  }
};

exports.unsubscribe = async (req, res) => {
  console.log(`UserController -- unsubscribe called`);

  const userId = req.userInfo.id;
  const channelId = req.params.channelId;

  // 检查userId与channelId是否相等
  if (userId === channelId) {
    return res.status(401).json({ error: "不能取消关注自己" });
  }

  // 检查是否已关注频道
  try {
    const subscribed = await Subscribe.findOne({ userId, channelId });
    if (!subscribed) {
      return res.status(401).json({ error: "不能取消未关注的频道" });
    } else {
      // 取消订阅频道入库
      let dbback = await subscribed.deleteOne();
      console.log(dbback);

      let user = await User.findById(channelId);
      user.subscribeCount--;
      user = await user.save();
      console.log(user);

      res.status(200).json({ msg: "取消订阅成功" });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({ error: "访问数据库时发生错误" });
  }
};
