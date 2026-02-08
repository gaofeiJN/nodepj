const express = require("express");
const router = express.Router();

const { verifyToken } = require("./jwt");
const videoController = require("./videoController");
const vodController = require("./vodController");

router
  .get(
    "/upload-auth/refresh",
    // verifyToken(),
    vodController.getRefreshUploadVideoAuth,
    videoController.getRefreshUploadVideoAuth,
  )
  .get(
    "/upload-auth",
    // verifyToken(),
    vodController.getCreateUploadVideoAuth,
    videoController.getCreateUploadVideoAuth,
  );

module.exports = router;
