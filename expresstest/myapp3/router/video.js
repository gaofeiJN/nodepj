const express = require("express");
const router = express.Router();

const videoController = require("../controller/videoController");

router.get("/", videoController.listVideos);

module.exports = router;
