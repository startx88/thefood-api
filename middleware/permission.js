const Auth = require('../model/auth');
exports.Permission = async (req, res, next) => {
  const user = await Auth.findById(req.user.userId);
  try {
    if (user.role === "partner" || user.role === "admin") {
      next()
    }
    else {
      const error = new Error("Unauthorized process!");
      error.statusCode = 401;
      throw next(error)
    }
  } catch (err) {
    next(err)
  }
}