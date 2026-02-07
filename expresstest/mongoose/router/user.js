const express = require("express");
const router = express.Router();

const { userController } = require("../controller/index");
const { userValidator } = require("../middleware/validator/index");
const { verifyToken } = require("../util/jwt");
const upload = require("../util/multer");

router
  .get("/userlist", verifyToken(), userController.getUserList)
  .get("/:userId/userinfo", userController.getUserInfo)
  .get(
    "/:channelId/subscribe",
    verifyToken(),
    userValidator.getSubscribeValidate,
    userController.getSubscribe,
  )
  .get(
    "/:channelId/unsubscribe",
    verifyToken(),
    userValidator.getUnsubscribeValidate,
    userController.getUnsubscribe,
  )
  .get(
    "/:userId/follow",
    verifyToken(),
    userValidator.getFollowValidate,
    userController.getFollow,
  )
  .get(
    "/:userId/fans",
    verifyToken(),
    userValidator.getFansValidate,
    userController.getFans,
  );

router
  .post(
    "/register",
    userValidator.postRegisterValidate,
    userController.postRegister,
  )
  .post(
    "/login", 
    userValidator.postLoginValidate, 
    userController.postLogin)
  .post(
    "/avatar",
    verifyToken(),
    upload.single("avatar"),
    userController.postAvatar,
  );

router
  .put(
    "/:userId/update",
    verifyToken(),
    userValidator.putUpdateValidate,
    userController.putUpdate,
  )
  .delete("/:userId", userController.deleteUser);

module.exports = router;
