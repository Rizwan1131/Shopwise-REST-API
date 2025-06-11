const sendErrorResponse = (res, statusCode = 500, message = "Server Error") => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default sendErrorResponse;