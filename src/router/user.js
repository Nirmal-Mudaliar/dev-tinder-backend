const express = require('express');
const { User } = require('../models/user');
const { getSuccessResponse, getErrorResponse } = require('../utils/response/response');
const { authMiddleware } = require('../middlewares/auth-middleware');

const router = express.Router();

router.use('/user', authMiddleware);

router.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params?.id;
    const user = await User.findById(userId);
    res.send(getSuccessResponse(user));
  }
  catch (error) {
    res.send(getErrorResponse(error.message));
  }
});

router.patch('/user/:id', async (req, res) => {
  try {
    const ALLOWED_UPDATE_KEYS = ['firstName', 'lastName', 'about', 'profileUrl'];
    const isValid = Object.keys(req.body).every((key) => ALLOWED_UPDATE_KEYS.includes(key));

    if (!isValid) throw new Error('Only firstname, lastName, about and profileUrl can be updated');

    const user = await User.findByIdAndUpdate(
      req.params?.id,
      req.body,
      {
        new: true,
      }
    );
    res.send(getSuccessResponse(user));
  }
  catch (error) {
    res.status(400).send(getErrorResponse(error.message))
  }
});

router.delete('/user', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body?.userId);
    res.send(getSuccessResponse(user));
  }
  catch (error) {
    res.status(400).send(getErrorResponse(error.message));
  }
})

module.exports = {
  userRouter: router,
}