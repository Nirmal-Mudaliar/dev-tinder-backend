const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../constants/constants');

const userSchema = new mongoose.Schema(
  {
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
      validate(emailId) {
        if (!validator.isEmail(emailId)) {
          throw new Error('Invalid email address' + emailId);
        }
      }
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
  },
  {
    timestamps: true,
  }
);

userSchema.methods.addJwtToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, SECRET_KEY, {
    expiresIn: '3d',
  });
  return token;
};

userSchema.methods.isPasswordValid = async function (password) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = {
  User
};