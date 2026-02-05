const { Video } = require("../model/index");

// 查找所有视频
exports.videoListAll = async (req, res) => {
  console.log("videoController -- videoListAll called");

  try {
    const videoListAll = await Video.find().sort({ createdAt: -1 });
    console.log(videoListAll);
    res.status(200).json(videoListAll);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "错误：查询不到视频信息" });
  }
};

// 根据页码pageNum和每页视频数量pageSize查找视频
exports.videoList = async (req, res) => {
  console.log("videoController -- videoList called");

  const { pageNum = 1, pageSize = 5 } = req.query;
  try {
    const videoList = await Video.find()
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate("userId"); // userId作为外键进行关联查询
    console.log(videoList);
    res.status(200).json(videoList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "错误：查询不到视频信息" });
  }
};

// 获取VOD上传权限
exports.CreateUploadVideo = async (req, res) => {
  console.log("videoController -- CreateUploadVideo called");

  res.status(200).json(req.alires);
};

// 更新VOD上传权限
exports.RefreshUploadVideo = async (req, res) => {
  console.log("videoController -- RefreshUploadVideo called");

  res.status(200).json(req.alires);
};

// 创建新视频
exports.createVideo = async (req, res) => {
  console.log("videoController -- createVideo called");
  console.log(req.body);

  let newVideo = new Video(req.body);
  newVideo.userId = req.userInfo._id;
  try {
    await newVideo.save();
    console.log(`Video created : ${newVideo}`);
    res.status(200).json(newVideo);
  } catch (error) {
    console.error("Error saving Video:", error);
    return res.status(500).json({ error: "Error creating Video" });
  }
};
