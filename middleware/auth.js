const User = require("../model/user");
const config = require("../config")

exports.auth = (req, res, next) => {
    const header = req.get('Authorization');
    if (!header) {
        const error = new Error("Unauthorized process");
        error.statusCode = 402;
        throw next(error)
    }
    const token = header.split(" ")[1];
    let verify;
    try {
        verify = User.verifyToken(token);
    } catch (error) {
        console.log("token verification error", error)
        next(error)
    }

    if (!verify) {
        const error = new Error("Unauthorized process");
        error.statusCode = 402;
        throw next(error)
    }

    req.user = verify;
    console.log(verify)
    next();
}