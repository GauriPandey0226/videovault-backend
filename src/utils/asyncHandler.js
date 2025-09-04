// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(error.status || 500);
//         res.json({  success: false, message: error.message || "Internal Server Error" });
//         // If you want to log the error, you can do it here
//         next(error);
//     }
// }
// export  { asyncHandler };

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };