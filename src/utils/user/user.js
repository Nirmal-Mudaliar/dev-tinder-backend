const { User } = require("../../models/user")
const mongoose = require('mongoose');

const isUserExist = async (userId) => {
  return !!await User.findById(userId);
}

const getAllUsers = () => {
  return User.find({});
}

const getUserById = (userId) => {
  return User.findById(userId);
}

const isValidId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  return true;
}

module.exports = {
  isUserExist,
  getAllUsers,
  getUserById,
  isValidId,
}