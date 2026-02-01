const express = require("express");
const router = express.Router();

const { userController } = require("../controller/index");
const userValidator = require("../middleware/validator/userValidator");
const { verifyToken } = require("../util/jwt");

router
  .get("/", verifyToken, userController.listUsers)
  .get("/:email", userController.getUser);

router
  .post("/registers", userValidator.register, userController.register)
  .post("/logins", userValidator.login, userController.login)
  .put("/updates", verifyToken, userValidator.update, userController.update)
  // .put("/:email", verifyToken, userController.update)
  .delete("/:email", userController.deleteUser);

module.exports = router;
