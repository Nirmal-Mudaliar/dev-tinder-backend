const express = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const { getSuccessResponse, getErrorResponse } = require('../utils/response/response');
const { validateProfileEditParams } = require('../utils/validators/profile-validators');
const { User } = require('../models/user');

const router = express.Router();

router.get('/profile/view', authMiddleware, (req, res) => {
  try {
    const user = req.user;
    res.send(getSuccessResponse(user));
  }
  catch (error) {
    res.status(400).send(getErrorResponse(error.message));
  }
});

router.patch('/profile/edit', authMiddleware, async (req, res) => {
  try {
    if (!validateProfileEditParams(req)) throw new Error('FirstName, lastName, about and profileUrl are editable');
    const user = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      req.body,
      {
        new: true
      }
    );
    res.send(getSuccessResponse(updatedUser));
  }
  catch (error) {
    res.status(400).send(getErrorResponse(error.message));
  }
})

module.exports = {
  profileRouter: router,
}