const router = require("koa-router")();

// 设置路由前缀
router.prefix("/api/comments");

// 获取评论列表
router.get("/", async (ctx) => {
  ctx.body = "获取评论列表";
});

// 获取指定id的评论
router.get("/:id", async (ctx) => {
  ctx.body = "获取指定id的评论";
});

// 创建评论
router.post("/", async (ctx) => {
  ctx.body = "创建评论";
});

// 更新指定id的评论
router.put("/:id", async (ctx) => {
  ctx.body = "更新指定id的评论";
});

// 删除指定id的评论
router.delete("/:id", async (ctx) => {
  ctx.body = "删除指定id的评论";
});

// 导出路由
module.exports = router;
