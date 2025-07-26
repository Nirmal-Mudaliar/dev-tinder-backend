const express = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const { getSuccessResponse, getErrorResponse } = require('../utils/response/response');

const router = express.Router();

router.get('/profile', authMiddleware, (req, res) => {
  try {
    const user = req.user;
    res.send(getSuccessResponse(user));
  }
  catch (error) {
    res.status(400).send(getErrorResponse(error.message));
  }
});

module.exports = {
  profileRouter: router,
}