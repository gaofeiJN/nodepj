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
    mongoose.connection.model("User", userSchema);
    console.log(util.inspect(mongoose.connection.models, true, 5, true));
    // console.log(mongoose.Connection.prototype);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectDB();
