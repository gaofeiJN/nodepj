const express = require("express");
const router = express.Router();

const { verifyToken } = require("../util/jwt");
const { videoValidator } = require("../middleware/validator/index");
const { videoController, vodController } = require("../controller/index");

router
  .get("/:id", verifyToken(false), videoController.getVideoInfo)
  .get("/listall", verifyToken(false), videoController.getVideoListAll)
  .get(
    "/list",
    verifyToken(false),
    videoValidator.getVideoListValidate,
    videoController.getVideoList,
  )
  .get(
    "/createuploadvideoauth",
    verifyToken(),
    vodController.getCreateUploadVideoAuth,
    videoController.getCreateUploadVideoAuth,
  )
  .get(
    "/refreshuploadvideoauth",
    verifyToken(),
    vodController.getRefreshUploadVideoAuth,
    videoController.getRefreshUploadVideoAuth,
  )
  .get(
    "/:videoId/commentlist",
    verifyToken(false),
    videoValidator.getCommentListValidate,
    videoController.getCommentList,
  );

router
  .post(
    "/creation",
    verifyToken(),
    videoValidator.postVideoCreationValidate,
    videoController.postVideoCreation,
  )
  .post(
    "/:videoId/comment",
    verifyToken(),
    videoValidator.postCommentValidate,
    videoController.postComment,
  );

router.delete(
  "/:videoId/comment/:commentId",
  verifyToken(),
  videoValidator.deleteCommentValidate,
  videoController.deleteComment,
);

module.exports = router;
