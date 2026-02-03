const express = require("express");
const router = express.Router();

const { userController } = require("../controller/index");
const userValidator = require("../middleware/validator/userValidator");
const { verifyToken } = require("../util/jwt");
const upload = require("../util/multer");

router
  .get("/", verifyToken, userController.listUsers)
  .get("/:email", userController.getUser);

router
  .post("/registers", userValidator.register, userController.register)
  .post("/logins", userValidator.login, userController.login)
  .post(
    "/avatars",
    verifyToken,
    upload.single("avatar"),
    userController.avatar,
  );

router
  .put("/updates", verifyToken, userValidator.update, userController.update)
  // .put("/:email", verifyToken, userController.update)
  .delete("/:email", userController.deleteUser);

module.exports = router;
