const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../constants/constants');
const { getUserById } = require('../utils/user/user');

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error('Invalid token');
    const { _id } = jwt.verify(token, SECRET_KEY);
    const user = await getUserById(_id);
    if (!user) throw new Error('User not found');
    req.user = user;
    next();
  }
  catch (error) {
    res.status(400).send('ERROR: ' + error.message)
  }

}

module.exports = {
  authMiddleware,
}