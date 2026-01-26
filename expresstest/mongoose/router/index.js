const express = require("express");
const router = express.Router();

const userRouter = require("./users");
const videoRouter = require("./videos");

router.use("/users", userRouter);
router.use("/videos", videoRouter);

module.exports = router;
