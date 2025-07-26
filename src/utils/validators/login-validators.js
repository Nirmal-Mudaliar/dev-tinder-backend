const validators = require('validator');

const loginValidator = (emailId, password) => {
  if (!emailId) throw new Error('Email cannot be null');
  if (!password) throw new Error('Password cannot be null');
  if (!validators.isEmail(emailId)) throw new Error('Email is not valid');
}

module.exports = {
  loginValidator,
}