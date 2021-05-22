const User = require("../model/auth");

exports.auth = (req, res, next) => {
    const header = req.get('Authorization');
    if (!header) {
        const error = new Error("Unauthorized process!");
        error.statusCode = 401;
        throw next(error)
    }
    const token = header.split(" ")[1];
    let verify;
    try {
        verify = User.verifyToken(token);
    } catch (error) {
        next(error)
    }

    if (!verify) {
        const error = new Error("Unauthorized process");
        error.statusCode = 401;
        throw next(error)
    }

    req.user = verify;

    next();
}