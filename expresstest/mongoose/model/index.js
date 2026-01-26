const mongoose = require("mongoose");
const userSchema = require("./userSchema");
const videoSchema = require("./videoSchema");

const util = require("util");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/gftst");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectDB();

module.exports = {
  User: mongoose.model("User", userSchema),
  Video: mongoose.model("Video", videoSchema),
};
