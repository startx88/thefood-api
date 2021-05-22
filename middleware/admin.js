const User = require('../model/auth');
exports.isAdmin = async (userId, next) => {
    const user = await User.findById(userId);
    if (user.role !== "admin") {
        const error = new Error("You have no permission to access the api");
        error.statusCode = 403;
        throw next(error);
    }

}