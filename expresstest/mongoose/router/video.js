const express = require("express");
const router = express.Router();

const { videoController } = require("../controller/index");

router.get("/", videoController.listVideos);

module.exports = router;
