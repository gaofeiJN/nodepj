const mongoose = require("mongoose");
const { User } = require("../model/index");

exports.listUsers = async (req, res) => {
  console.log("UserController -- listUsers called");
  res.send("List of users");
};

exports.getUser = async (req, res) => {
  const userId = req.params.id;
  console.log(`UserController -- getUser called with ID: ${userId}`);
  res.send(`User details for user ID: ${userId}`);
};

exports.createUser = async (req, res) => {
  console.log("UserController -- createUser called");
  console.log(req.body);

  let newUser = new User(req.body);
  try {
    await newUser.save();
    console.log(`User created : ${newUser}`);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).send("Error creating user");
  }
};

exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  console.log(`UserController -- updateUser called with ID: ${userId}`);
  res.send(`User updated for user ID: ${userId}`);
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  console.log(`UserController -- deleteUser called with ID: ${userId}`);
  res.send(`User deleted for user ID: ${userId}`);
};
