const { ConnectionRequest } = require("../../models/connection");
const { isUserExist, isValidId } = require('../user/user');

const isValidStatusInConnectionRequestParams = (status) => {
  const ALLOWED_STATUS_VALUES = ['interested', 'ignored'];
  return ALLOWED_STATUS_VALUES.includes(status);
}

const isConnectionRequestAlreadyExist = async (fromUserId, toUserId) => {
  const connection = await ConnectionRequest.findOne(
    {
      $or: [
        {
          fromUserId,
          toUserId,
        },
        {
          toUserId,
          fromUserId,
        }
      ]
    }
  );
  if (connection) return true;
  return false;
}

const validateConnectionRequestParams = async (fromUserId, toUserId, status) => {
  if (fromUserId == toUserId) throw new Error('FromUserId is same as ToUserId');
  if (!isValidStatusInConnectionRequestParams(status)) throw new Error('Status is not valid');
  if (!isValidId(toUserId)) throw new Error('User Id is not valid');
  const isUserExistInDB = await isUserExist(toUserId);
  if (!isUserExistInDB) throw new Error('User does not exist');
  const isConnectionExist = await isConnectionRequestAlreadyExist(fromUserId, toUserId);
  if (isConnectionExist) throw new Error('Connection request already exist');
}

module.exports = {
  isValidStatusInConnectionRequestParams,
  isConnectionRequestAlreadyExist,
  validateConnectionRequestParams,
}