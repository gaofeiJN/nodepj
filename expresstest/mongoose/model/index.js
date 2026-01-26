const mongoose = require("mongoose");
const userSchema = require("./userModel");
const videoSchema = require("./videoModel");

module.exports = {
  User: mongoose.model("User", userSchema),
  Video: mongoose.model("Video", videoSchema),
};
