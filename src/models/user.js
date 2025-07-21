const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
  },
  age: {
    type: String,
  },
  gender: {
    type: String,
  },
  profileUrl: {
    type: String,
    default: 'https://www.pngitem.com/middle/hxRbRT_profile-icon-png-default-profile-picture-png-transparent/',
  },
  about: {
    type: String,
    default: 'Hey, looking forward to connect!',
  }
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User
};