const multer = require("multer");
const path = require("path");

// 配置multer

// 配置multer存储引擎
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatars/");
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname); // 扩展名
    const baseName = path.basename(file.originalname, extname);
    cb(null, `${baseName}-${suffix}${extname}`); // suffix和extname中间没有"."
  },
});

// 文件过滤器
const fileFilter = function (req, file, cb) {
  // 允许的文件类型
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extnameTest = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetypeTest = allowedTypes.test(file.mimetype);

  if (extnameTest && mimetypeTest) {
    cb(null, true);
  } else {
    cb(new Error("只允许上传图片文件 (JPEG, JPG, PNG, GIF)"));
  }
};

// 创建multer实例
exports.uploadAvatar = multer({
  storage: storage,
  limits: {
    fileSize: 16 * 1024 * 1024,
  },
  fileFilter: fileFilter,
});

// 配置multer

// 配置multer存储引擎
const storageVideo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/videos/");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

// 文件过滤器
const fileFilterVideo = function (req, file, cb) {
  // 允许的文件类型
  const allowedTypes = /mp4|mov/;
  const extnameTest = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetypeTest = allowedTypes.test(file.mimetype);

  if (extnameTest && mimetypeTest) {
    cb(null, true);
  } else {
    cb(new Error("只允许上传视频文件 (/mp, mov)"));
  }
};

// 创建multer实例
exports.uploadVideo = multer({
  storage: storageVideo,
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
  fileFilter: fileFilterVideo,
});
