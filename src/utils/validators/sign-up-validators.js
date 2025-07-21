const validators = require('validator');

function signUpValidator(firstName, lastName, emailId, password) {
  if (!firstName) throw new Error('First Name is required');
  if (!lastName) throw new Error('Last Name is required');
  if (!validators.isEmail(emailId)) throw new Error('Email is invalid');
  if (!validators.isStrongPassword(password)) throw new Error('Enter strong password');
}

module.exports = {
  signUpValidator,
}