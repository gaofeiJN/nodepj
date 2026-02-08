const { User, Subscribe, Approval, Favor } = require("../model/index");
const { createToken } = require("../util/jwt");

// 注册新用户
exports.postRegister = async (req, res) => {
  console.log("UserController -- postRegister called");
  console.log(req.body);

  let newUser = new User(req.body);
  try {
    await newUser.save();
    console.log(`User created : ${newUser}`);

    // 201  Created  请求成功，服务器创建了新资源（通常在POST或PUT请求后返回）
    // res.status(201).json(newUser.toJSON()); //res.json()方法会调用newUser.toJSON()
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error saving user:", error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "Error creating user" });
  }
};

// 用户登录
exports.postLogin = async (req, res) => {
  console.log("UserController -- postLogin called");
  const { name, phone, email, password } = req.body;
  let user;
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
      // 404  Not Found  请求的资源不存在（如URL错误或资源被删除）
      return res.status(404).json({ error: "未找到该用户" });
    }
    console.log(user);

    // 比较密码
    if (!user.comparePasswordSync(password)) {
      // 401  Unauthorized  请求需要身份认证（如用户名或密码缺失或错误）
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
    // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
    res.status(200).json(userJSON);
  } catch (error) {
    console.error("Error logging in user:", error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "Error logging in user" });
  }
};

exports.putUpdate = async (req, res) => {
  console.log(`UserController -- putUpdate called`);

  try {
    if (!req.userInfo || !req.userInfo._id) {
      // 400  Bad Request  请求存在语法错误（如参数格式无效）
      return res.status(400).json({ error: "Missing user id" });
    }
    let newUser = await User.findByIdAndUpdate(req.userInfo._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!newUser) {
      // 404  Not Found  请求的资源不存在（如URL错误或资源被删除）
      return res.status(404).json({ error: "User not found" });
    }
    console.log(newUser);

    // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
    res.status(200).json(newUser);
  } catch (error) {
    console.log(error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "Error updating user" });
  }
};

exports.postAvatar = async (req, res) => {
  console.log(`UserController -- postAvatar called`);

  // console.log(req.file);
  // 更新用户的头像信息
  let avatar = "avatars/" + req.file.filename;
  try {
    let newUser = await User.findByIdAndUpdate(
      req.userInfo._id,
      { image: avatar },
      { new: true },
    );
    if (!newUser) {
      // 404  Not Found  请求的资源不存在（如URL错误或资源被删除）
      return res.status(404).json({ error: "用户不存在" });
    }

    let userJSON = newUser.toJSON();
    console.log(`用户头像更改成功 \n ${userJSON}`);

    // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
    res.status(200).json({ avatar: userJSON.image });
  } catch (error) {
    console.log(error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "用户头像更改失败" });
  }
};

exports.getSubscribe = async (req, res) => {
  console.log(`UserController -- getSubscribe called`);

  const userId = req.userInfo._id;
  const channelId = req.params.channelId;

  // 检查userId与channelId是否相等
  if (userId === channelId) {
    // 403  Forbidden  服务器拒绝请求，客户端无访问权限（细分如403.1执行权限问题、403.6 IP封禁等）
    return res.status(403).json({ error: "不能关注自己" });
  }

  // 检查是否已关注频道
  try {
    const subscribed = await Subscribe.findOne({ userId, channelId });
    if (subscribed) {
      // 403  Forbidden  服务器拒绝请求，客户端无访问权限（细分如403.1执行权限问题、403.6 IP封禁等）
      return res.status(403).json({ error: "已关注此频道" });
    }
  } catch (error) {
    console.log(error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res
      .status(500)
      .json({ error: "错误：无法从数据库获取关注频道的信息" });
  }

  // 订阅频道入库
  let newSubscribe = new Subscribe({ userId, channelId });
  try {
    let dbResult = await newSubscribe.save();
    console.log(dbResult);

    let user = await User.findById(channelId);
    user.subscribeCount++;
    user = await user.save();
    console.log(user);

    // 201  Created  请求成功，服务器创建了新资源（通常在POST或PUT请求后返回）
    res.status(201).json({ msg: "订阅成功" });
  } catch (error) {
    console.log(error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "订阅失败" });
  }
};

// 取消订阅
exports.getUnsubscribe = async (req, res) => {
  console.log(`UserController -- getUnsubscribe called`);

  const userId = req.userInfo._id;
  const channelId = req.params.channelId;

  // 检查userId与channelId是否相等
  if (userId === channelId) {
    // 403  Forbidden  服务器拒绝请求，客户端无访问权限（细分如403.1执行权限问题、403.6 IP封禁等）
    return res.status(403).json({ error: "不能取消关注自己" });
  }

  // 检查是否已关注频道
  try {
    const subscribed = await Subscribe.findOne({ userId, channelId });
    if (!subscribed) {
      // 403  Forbidden  服务器拒绝请求，客户端无访问权限（细分如403.1执行权限问题、403.6 IP封禁等）
      return res.status(403).json({ error: "不能取消未关注的频道" });
    } else {
      // 取消订阅频道入库
      let dbResult = await subscribed.deleteOne();
      console.log(dbResult);

      let user = await User.findById(channelId);
      user.subscribeCount--;
      user = await user.save();
      console.log(user);

      // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
      res.status(200).json({ msg: "取消订阅成功" });
    }
  } catch (error) {
    console.log(error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "访问数据库时发生错误" });
  }
};

// 获取用户订阅的频道列表
exports.getFollow = async (req, res) => {
  console.log(`UserController -- getFollow called`);

  const userId = req.params.userId;
  try {
    const followList = await Subscribe.find({ userId })
      .sort({ createdAt: -1 })
      .populate("channelId", "_id name image");

    // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
    res.status(200).json(followList);
  } catch (error) {
    console.log(error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "访问数据库时发生错误" });
  }
};

// 获取用户的粉丝列表
exports.getFans = async (req, res) => {
  console.log(`UserController -- getFans called`);

  const userId = req.params.userId;
  try {
    const fanList = await Subscribe.find({ channelId: userId })
      .sort({ createdAt: -1 })
      .populate("userId", "_id name image");

    // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
    res.status(200).json(fanList);
  } catch (error) {
    console.log(error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "访问数据库时发生错误" });
  }
};

// 获取用户的点赞视频列表
exports.getApprovals = async (req, res) => {
  console.log(`UserController -- getApproval called`);

  const userId = req.params.userId;
  try {
    const approvalList = await Approval.find({ userId }).sort({
      createdAt: -1,
    });

    // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
    res.status(200).json(approvalList);
  } catch (error) {
    console.log(error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "访问数据库时发生错误" });
  }
};

// 获取用户的收藏视频列表
exports.getFavorites = async (req, res) => {
  console.log(`UserController -- getFavor called`);

  const userId = req.params.userId;
  try {
    const favorList = await Favor.find({ userId }).sort({
      folder: 1,
      createdAt: -1,
    });

    // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
    res.status(200).json(favorList);
  } catch (error) {
    console.log(error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "访问数据库时发生错误" });
  }
};
