const express = require("express");
const router = express.Router();

const { userController } = require("../controller/index");
const { userRegister } = require("../middleware/validator/userValidator");

router.get("/", userController.listUsers).get("/:id", userController.getUser);

router
  .post("/registers", userRegister, userController.createUser)
  .put("/:id", userController.updateUser)
  .delete("/:id", userController.deleteUser);

module.exports = router;
