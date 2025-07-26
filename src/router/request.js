const express = require('express');
const { authMiddleware } = require('../middlewares/auth-middleware');
const { ConnectionRequest } = require('../models/connection');
const { getErrorResponse, getSuccessResponse } = require('../utils/response/response');
const { validateConnectionRequestParams } = require('../utils/validators/request-validator');

const router = express.Router();

router.use('/', authMiddleware);

router.post('/request/send/:status/:toUserId', async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    await validateConnectionRequestParams(fromUserId, toUserId, status);
    
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    const connection = await connectionRequest.save();
    res.send(getSuccessResponse(connection));
  }
  catch (error) {
    res.status(400).send(getErrorResponse(error.message));
  }
})

module.exports = {
  requestRouter: router,
}