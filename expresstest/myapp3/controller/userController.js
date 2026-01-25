exports.listUsers = async (req, res) => {
  console.log("UserController -- listUsers called");
  res.send("List of users");
};
exports.getUser = async (req, res) => {
  const userId = req.params.id;
  console.log(`UserController -- getUser called with ID: ${userId}`);
  res.send(`User details for user ID: ${userId}`);
};
