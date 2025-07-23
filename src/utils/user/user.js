const { User } = require("../../models/user")

const isUserExist = (userId) => {
  return !!User.findById(userId);
}

const getAllUsers = () => {
  return User.find({});
}

const getUserById = (userId) => {
  return User.findById(userId);
}

module.exports = {
  isUserExist,
  getAllUsers,
  getUserById,
}