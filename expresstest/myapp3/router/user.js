const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

router.get("/", userController.listUsers).get("/:id", userController.getUser);

module.exports = router;
