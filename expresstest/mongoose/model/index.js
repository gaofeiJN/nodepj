const mongoose = require("mongoose");
const userSchema = require("./userSchema");
const videoSchema = require("./videoSchema");
const subscribeSchema = require("./subscribeSchema");
const { MONGO_PATH } = require("../config");

async function connectDB() {
  try {
    await mongoose.connect(MONGO_PATH);
    console.log(`Connected to MongoDB : ${MONGO_PATH}`);
  } catch (error) {
    console.error("Error connecting to MongoDB: ${MONGO_PATH} \n", error);
  }
}

connectDB();

module.exports = {
  User: mongoose.model("User", userSchema),
  Video: mongoose.model("Video", videoSchema),
  Subscribe: mongoose.model("Subscribe", subscribeSchema),
};
