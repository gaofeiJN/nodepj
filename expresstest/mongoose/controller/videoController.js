const { Video, Comment, Approval, Favor } = require("../model/index");
const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");

// 查找指定视频
exports.getVideo = async (req, res) => {
  console.log("videoController -- getVideo called");
  console.log(req.params);

  try {
    const videoDoc = await Video.findById(req.params.videoId).populate(
      "user",
      "_id name image",
    );
    const video = videoDoc.toJSON();
    video.isFavarite = false;
    video.isApproval = false;

    const favorite = await Favor.findOne({ video: video._id });
    if (favorite) video.isFavarite = true;

    const approval = await Approval.findOne({ video: video._id });
    if (approval) video.isApproval = true;

    console.log(video);

    // 【现代WEB开发】
    // 前后端分离开发（SPA 单页面应用）
    // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
    // res.status(200).json(video);

    // 【传统模式】
    // 服务器端渲染（SSR server side render）
    // const htmlPath = path.join(
    //   __dirname,
    //   "public",
    //   "src",
    //   "html",
    //   "video-player.html",
    // );
    let htmlContent = fs.readFileSync(
      "./public/src/html/video-player.html",
      "utf8",
    );
    console.log(htmlContent);

    // 加载html文档，将其解析为DOM
    const $ = cheerio.load(htmlContent);

    // 为元素对象设置属性
    $("#myVideo").attr("src", video.url);
    $("#myVideoTitle").text(video.title);
    $("#myVideoDescription").text(video.description);

    // 返回给客户端
    htmlContent = $.html();
    console.log(htmlContent);

    res.status(200).send(htmlContent);
  } catch (error) {
    console.log(error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    res.status(500).json({ error: "错误：查询不到视频信息" });
  }
};

// 查找所有视频
exports.getVideoListAll = async (req, res) => {
  console.log("videoController -- getVideoListAll called");

  try {
    const videoListAll = await Video.find().sort({ createdAt: -1 });
    console.log(videoListAll);

    // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
    res.status(200).json(videoListAll);
  } catch (error) {
    console.log(error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    res.status(500).json({ error: "错误：查询不到视频信息" });
  }
};

// 根据页码pageNum和每页视频数量pageSize查找视频
exports.getVideoList = async (req, res) => {
  console.log("videoController -- getVideoList called");

  const { pageNum = 1, pageSize = 5 } = req.query;
  try {
    const videoList = await Video.find()
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate("user", "_id name image"); // user作为外键进行关联查询
    console.log(videoList);

    // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
    res.status(200).json(videoList);
  } catch (error) {
    console.log(error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    res.status(500).json({ error: "错误：查询不到视频信息" });
  }
};

// 创建新视频
exports.postVideo = async (req, res) => {
  console.log("videoController -- postVideo called");
  console.log(req.body.title);
  console.log(req.file);

  let videoObj = {};
  videoObj.title = req.body.title;
  videoObj.fileName = req.file.filename;
  videoObj.url = "./" + req.file.filename;
  videoObj.description = req.body.description ? req.body.description : null;
  videoObj.user = req.userInfo._id;

  let newVideo = new Video(videoObj);
  try {
    await newVideo.save();
    console.log(`Video created : ${newVideo}`);

    // 201  Created  请求成功，服务器创建了新资源（通常在POST或PUT请求后返回）
    res.status(201).json(newVideo);
  } catch (error) {
    console.error("Error saving Video:", error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "Error creating Video" });
  }
};

// 创建评论
exports.postComment = async (req, res) => {
  console.log("videoController -- postComment called");
  console.log(req.body);
  console.log(req.params);

  const user = req.userInfo._id;
  const video = req.params.videoId;
  const content = req.body.content;
  let newComment = new Comment({ content, video, user });
  try {
    newComment = await newComment.save();
    console.log(`Comment created : ${newComment}`);

    // 201  Created  请求成功，服务器创建了新资源（通常在POST或PUT请求后返回）
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error saving Comment:", error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "Error creating Comment" });
  }
};

// 获取评论列表
exports.getCommentList = async (req, res) => {
  console.log("videoController -- getCommentList called");
  console.log(req.params);

  const video = req.params.videoId;
  try {
    const commentList = await Comment.find({ video }).populate(
      "user",
      "_id name image",
    );
    console.log(`Comment list : ${commentList}`);

    // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
    res.status(200).json(commentList);
  } catch (error) {
    console.error("Error getting CommentList:", error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "Error getting CommentList" });
  }
};

// 删除评论
exports.deleteComment = async (req, res) => {
  console.log("videoController -- deleteComment called");
  console.log(req.params);

  const video = req.params.videoId;
  const commentId = req.params.commentId;
  const user = req.userInfo._id;
  try {
    const comment = await Comment.findById(commentId);
    // 【注意】验证token后的负载中的user是字符串类型，不能直接和mongoose.Types.ObjectId类型的数据比较
    // if (comment.user !== req.userInfo._id)  ==> 类型不同，返回false

    // 比较方法一：调用mongoose.Types.ObjectId的.toString()方法
    if (comment.user.toString() !== user) {
      console.log("不能删除别人的评论");
      // console.log(comment);
      console.log(comment.user);
      console.log(user);

      // 403：通过了token验证，服务器理解客户端的意图，但是因为没有权限而拒绝了用户的操作
      return res.status(403).json({ error: "不能删除别人的评论" });
    }
    // 【注意】req.params.videoId是字符串类型，不能直接和mongoose.Types.ObjectId类型的数据比较
    // if (comment.video !== req.params.videoId)  ==> 类型不同，返回false

    // 比较方法二：调用mongoose.Types.ObjectId的实例方法.equals()方法
    if (!comment.video.equals(req.params.videoId)) {
      // 403：通过了token验证，服务器理解客户端的意图，但是因为没有权限而拒绝了用户的操作
      return res.status(403).json({ error: "不能删除其他视频的评论" });
    }
    const result = await comment.deleteOne();
    console.log(`Comment deleted : ${result}`);

    // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
    res.status(200).json({ msg: "已删除评论" });
  } catch (error) {
    console.error("Error deleting comment:", error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "Error deleting comment" });
  }
};

// 点赞视频
exports.getVideoApproval = async (req, res) => {
  console.log("videoController -- getVideoApproval called");

  const user = req.userInfo._id;
  const video = req.params.videoId;

  try {
    let approval = await Approval.findOne({ user, video });
    let videoDoc = await Video.findById(video);

    // 如果已经点赞过，则删除点赞记录，同时video的点赞数量减1
    if (approval) {
      await approval.deleteOne();
      videoDoc.approvalCount--;
      await videoDoc.save();

      console.log("取消点赞");
      // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
      res.status(200).json({ msg: "取消点赞" });
    }
    // 如果没有点赞过，则新建点赞记录，同时video的点赞数量加1
    else {
      approval = new Approval({ video, user });
      await approval.save();
      videoDoc.approvalCount++;
      await videoDoc.save();

      console.log("点赞成功");
      // 201  Created  请求成功，服务器创建了新资源（通常在POST或PUT请求后返回）
      res.status(201).json({ msg: "点赞成功" });
    }
  } catch (error) {
    console.error("Error saving Approval:", error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "Error saving Approval" });
  }
};

// 点赞视频
exports.getVideoFavor = async (req, res) => {
  console.log("videoController -- getVideoFavor called");

  const user = req.userInfo._id;
  const video = req.params.videoId;
  let folder = req.params.folder;
  if (!folder) folder = "默认收藏夹";

  try {
    let favor = await Favor.findOne({ user, video, folder });
    let videoDoc = await Video.findById(video);

    // 如果已经收藏过，则删除收藏记录，同时video的收藏数量减1
    if (favor) {
      await favor.deleteOne();
      videoDoc.favorCount--;
      await videoDoc.save();

      console.log("取消收藏");
      // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
      res.status(200).json({ msg: "取消收藏" });
    }
    // 如果没有收藏过，则新建收藏记录，同时video的收藏数量加1
    else {
      favor = new Favor({ video, user, folder });
      await favor.save();
      videoDoc.favorCount++;
      await videoDoc.save();

      console.log("收藏成功");
      // 201  Created  请求成功，服务器创建了新资源（通常在POST或PUT请求后返回）
      res.status(201).json({ msg: "收藏成功" });
    }
  } catch (error) {
    console.error("Error saving Favor:", error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    return res.status(500).json({ error: "Error saving Favor" });
  }
};
