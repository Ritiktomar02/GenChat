const User = require("../models/user.model");

exports.createUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const hashedPassword = await User.hashPassword(password);

  const user = await User.create({
    email,
    password: hashedPassword
  });

  return user;
};


exports.getAllUsers = async ({ userId }) => {
    const users = await User.find({
        _id: { $ne: userId }
    });
    return users;
}