const express = require("express");
const router = express.Router();

const { userController } = require("../controller/index");
const { userValidator } = require("../middleware/validator/index");
const { verifyToken } = require("../util/jwt");
const { uploadAvatar } = require("../util/multer");

router
  .post(
    "/register",
    userValidator.postRegisterValidate,
    userController.postRegister,
  )
  .post("/login", userValidator.postLoginValidate, userController.postLogin)
  .post(
    "/avatar",
    verifyToken(),
    uploadAvatar.single("avatar"),
    userController.postAvatar,
  );

router
  .post(
    "/:channelId/subscribe",
    verifyToken(),
    userValidator.postSubscribeValidate,
    userController.getSubscribe,
  )
  .delete(
    "/:channelId/subscribe",
    verifyToken(),
    userValidator.deleteSubscribeValidate,
    userController.getUnsubscribe,
  )
  .get(
    "/:userId/following",
    verifyToken(),
    userValidator.getFollowingValidate,
    userController.getFollow,
  )
  .get(
    "/:userId/followers",
    verifyToken(),
    userValidator.getFollowersValidate,
    userController.getFans,
  )
  .get(
    "/:userId/approvals",
    verifyToken(),
    userValidator.getApprovalsValidate,
    userController.getApprovals,
  )
  .get(
    "/:userId/favorites",
    verifyToken(),
    userValidator.getFavoritesValidate,
    userController.getFavorites,
  );

// 用户更新和删除路由
router.put(
  "/:userId",
  verifyToken(),
  userValidator.putUpdateValidate,
  userController.putUpdate,
);

module.exports = router;
