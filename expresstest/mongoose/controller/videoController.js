const { Video, Comment } = require("../model/index");
const mongoose = require("mongoose");

// 查找指定视频
exports.getVideoInfo = async (req, res) => {
  console.log("videoController -- getVideoInfo called");
  console.log(req.params);

  try {
    const video = await Video.findById(req.params.id).populate(
      "userId",
      "_id name image",
    );
    console.log(video);

    // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
    res.status(200).json(video);
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
      .populate("userId", "_id name image"); // userId作为外键进行关联查询
    console.log(videoList);

    // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
    res.status(200).json(videoList);
  } catch (error) {
    console.log(error);

    // 500  Internal Server Error  服务器内部错误（如代码缺陷）
    res.status(500).json({ error: "错误：查询不到视频信息" });
  }
};

// 获取VOD上传权限
exports.getCreateUploadVideoAuth = async (req, res) => {
  console.log("videoController -- getCreateUploadVideoAuth called");

  // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
  res.status(200).json(req.alires);
};

// 更新VOD上传权限
exports.getRefreshUploadVideoAuth = async (req, res) => {
  console.log("videoController -- getRefreshUploadVideoAuth called");

  // 200  OK  请求成功完成，服务器返回了期望的响应内容（如网页或数据）
  res.status(200).json(req.alires);
};

// 创建新视频
exports.postVideoCreation = async (req, res) => {
  console.log("videoController -- postVideoCreation called");
  console.log(req.body);

  let newVideo = new Video(req.body);
  newVideo.userId = req.userInfo._id;
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

  const userId = req.userInfo._id;
  const videoId = req.params.videoId;
  const content = req.body.content;
  var newComment = new Comment({ content, videoId, userId });
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

  const videoId = req.params.videoId;
  try {
    const commentList = await Comment.find({ videoId }).populate(
      "userId",
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

  const videoId = req.params.videoId;
  const commentId = req.params.commentId;
  const userId = req.userInfo._id;
  try {
    const comment = await Comment.findById(commentId);
    // 【注意】验证token后的负载中的userId是字符串类型，不能直接和mongoose.Types.ObjectId类型的数据比较
    // if (comment.userId !== req.userInfo._id)  ==> 类型不同，返回false

    // 比较方法一：调用mongoose.Types.ObjectId的.toString()方法
    if (comment.userId.toString() !== userId) {
      console.log("不能删除别人的评论");
      // console.log(comment);
      console.log(commentObj.userId);
      console.log(userId);

      // 403：通过了token验证，服务器理解客户端的意图，但是因为没有权限而拒绝了用户的操作
      return res.status(403).json({ error: "不能删除别人的评论" });
    }
    // 【注意】req.params.videoId是字符串类型，不能直接和mongoose.Types.ObjectId类型的数据比较
    // if (comment.videoId !== req.params.videoId)  ==> 类型不同，返回false

    // 比较方法二：调用mongoose.Types.ObjectId的实例方法.equals()方法
    if (!comment.videoId.equals(req.params.videoId)) {
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
