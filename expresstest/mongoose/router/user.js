const express = require("express");
const router = express.Router();

const { userController } = require("../controller/index");

router.get("/", userController.listUsers).get("/:id", userController.getUser);
router
  .post("/", userController.createUser)
  .put("/:id", userController.updateUser)
  .delete("/:id", userController.deleteUser);

module.exports = router;
