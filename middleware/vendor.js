const User = require('../model/auth');
exports.isVendor = async (userId, next) => {
  const user = await User.findById(userId);
  if (user.role !== "partner") {
    const error = new Error("Only vendor can create a restaurant");
    error.statusCode = 403;
    throw next(error);
  }
}