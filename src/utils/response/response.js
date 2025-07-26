const getSuccessResponse = (data, message) => {
  return {
    success: true,
    message: message,
    data,
  }
}

const getErrorResponse = (error, message) => {
  return {
    success: false,
    message: message,
    error,
  }
}

module.exports = {
  getSuccessResponse,
  getErrorResponse,
}