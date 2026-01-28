const express = require("express");
const router = express.Router();

const { userController } = require("../controller/index");
const userValidator = require("../middleware/validator/userValidator");

router.get("/", userController.listUsers).get("/:id", userController.getUser);

router
  .post("/registers", userValidator.register, userController.register)
  .post("/logins", userValidator.login, userController.login)
  .put("/:id", userController.updateUser)
  .delete("/:id", userController.deleteUser);

module.exports = router;
