const express = require('express');
const { getSuccessResponse, getErrorResponse } = require('../utils/response/response');
const { authMiddleware } = require('../middlewares/auth-middleware');
const { User } = require('../models/user');

const router = express.Router();

router.use('/feed', authMiddleware);

router.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(getSuccessResponse(users));
  }
  catch (error) {
    res.status(400).send(getErrorResponse(error.message));
  }
});

module.exports = {
  feedRouter: router,
}