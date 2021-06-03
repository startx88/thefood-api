const Auth = require('../model/auth');
exports.Permission = async (req, res, next) => {
  const user = await Auth.findById(req.user.userId);
  if (user.role !== "partner" || user.role !== "admin") {
    const error = new Error("Access denined");
    error.statusCode = 403;
    throw next(error);
  }
}