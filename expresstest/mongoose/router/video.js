const express = require("express");
const router = express.Router();

const { verifyToken } = require("../util/jwt");
const { videoValidator } = require("../middleware/validator/index");
const { videoController, vodController } = require("../controller/index");

router
  .get("/listAll", verifyToken, videoController.videoListAll)
  .get(
    "/list",
    verifyToken,
    videoValidator.videoList,
    videoController.videoList,
  )
  .get(
    "/CreateUploadVideo",
    verifyToken,
    vodController.CreateUploadVideo,
    videoController.CreateUploadVideo,
  )
  .get(
    "/RefreshUploadVideo",
    verifyToken,
    vodController.RefreshUploadVideo,
    videoController.RefreshUploadVideo,
  );

router.post(
  "/creations",
  verifyToken,
  videoValidator.createVideo,
  videoController.createVideo,
);

module.exports = router;
