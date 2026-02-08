const express = require("express");
const router = express.Router();

const { verifyToken } = require("../util/jwt");
const { videoValidator } = require("../middleware/validator/index");
const { videoController, vodController } = require("../controller/index");
const { uploadVideo } = require("../util/multer");

router
  .get("/all", verifyToken(false), videoController.getVideoListAll)
  .get(
    "/list",
    verifyToken(false),
    videoValidator.getVideoListValidate,
    videoController.getVideoList,
  )
  .get("/:videoId", verifyToken(false), videoController.getVideoInfo)
  .get(
    "/:videoId/comments",
    verifyToken(false),
    videoValidator.getCommentsValidate,
    videoController.getCommentList,
  )
  .get(
    "/:videoId/approvals",
    verifyToken(),
    videoValidator.getVideoApprovalsValidate,
    videoController.getVideoApproval,
  )
  .get(
    ["/:videoId/favorites", "/:videoId/favorites/:folder"],
    verifyToken(),
    videoValidator.getVideoFavoritesValidate,
    videoController.getVideoFavor,
  );

router
  .post(
    "/",
    verifyToken(),
    uploadVideo.single("video"),
    videoValidator.postVideoValidate,
    videoController.postVideo,
  )
  .post(
    "/:videoId/comments",
    verifyToken(),
    videoValidator.postCommentValidate,
    videoController.postComment,
  );

router.delete(
  "/:videoId/comments/:commentId",
  verifyToken(),
  videoValidator.deleteCommentValidate,
  videoController.deleteComment,
);

module.exports = router;
