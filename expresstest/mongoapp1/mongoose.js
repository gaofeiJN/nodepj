const mongoose = require("mongoose");
const util = require("util");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/gftst");
    console.log("Connected to MongoDB");

    // console.log(mongoose.connection);
    const userSchema = new mongoose.Schema({
      name: String,
      age: Number,
      city: String,
    });
    const User = mongoose.connection.model("User", userSchema);
    const userlist = await User.find();
    console.log(userlist); // 打印结果：document的数组
    // console.log(mongoose.Connection.prototype);
    // console.log(util.inspect(mongoose.connection.models, true, 5, true));
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectDB();
