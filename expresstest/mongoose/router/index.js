const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const videoRouter = require("./video");

router.use(express.static("public"));
router.use("/user", userRouter);
router.use("/video", videoRouter);

module.exports = router;
