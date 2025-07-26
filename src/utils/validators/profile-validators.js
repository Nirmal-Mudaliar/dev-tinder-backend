const validateProfileEditParams = (req) => {
  const ALLOWED_UPDATE_KEYS = ['firstName', 'lastName', 'profileUrl', 'about'];
  const isAllowed = Object.keys(req.body).every((field) => ALLOWED_UPDATE_KEYS.includes(field));
  return isAllowed;
}

module.exports = {
  validateProfileEditParams,
}