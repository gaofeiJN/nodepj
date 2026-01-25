const express = require("express");
const router = express.Router();

// 路由级别的中间件函数的使用
router.get(
  "/",
  (req, res, next) => {
    console.log("路由级别的中间件");
    next();
  },
  (req, res) => {
    res.send("This is router middleware test page");
  },
);

module.exports = router;
