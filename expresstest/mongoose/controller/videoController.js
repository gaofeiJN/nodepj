exports.listVideos = async (req, res) => {
  console.log("VideoController -- listVideos called");
  res.send("List of videos");
};

// 获取VOD上传权限
exports.getvod = async (req, res) => {
  console.log("VideoController -- getvod called");
  res.status(200).json(req.alires);
};
