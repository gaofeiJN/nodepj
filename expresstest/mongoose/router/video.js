const express = require("express");
const router = express.Router();

const { verifyToken } = require("../util/jwt");
const { videoController, vodController } = require("../controller/index");

router
  .get("/", verifyToken, videoController.listVideos)
  .post(
    "/getvod",
    verifyToken,
    vodController.createUploadVideo,
    videoController.getvod,
  );

module.exports = router;
