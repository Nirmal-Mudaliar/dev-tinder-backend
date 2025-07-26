const express = require('express');
const bcrypt = require('bcrypt');

const { signUpValidator } = require('../utils/validators/sign-up-validators');
const { loginValidator } = require('../utils/validators/login-validators');
const { User } = require('../models/user');
const { getSuccessResponse, getErrorResponse } = require('../utils/response/response');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    signUpValidator(firstName, lastName, emailId, password);
    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = new User(({
      firstName,
      lastName,
      emailId,
      password: encryptedPassword,
    }));
    await user.save();
    res.send(getSuccessResponse());
  }
  catch (error) {
    res.status(400).send(getErrorResponse(error.message));
  }
});

router.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    loginValidator(emailId, password);
    const user = await User.findOne({ emailId });
    if (!user) throw new Error('Invalid credentials');
    const isValidPassword = await user.isPasswordValid(password);
    if (!isValidPassword) throw new Error('Invalid credentials');

    // generate token
    const token = await user.addJwtToken();
    res.cookie('token', token);
    res.send(getSuccessResponse(token));
  }
  catch (error) {
    res.status(400).send(getErrorResponse(error.message));
  }
});

module.exports = {
  authRouter: router,
}
