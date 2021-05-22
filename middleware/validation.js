const { validationResult } = require('express-validator')

const hasError = (message = "not found", statusCode = 404, next) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw next(error);
}

const validationError = (req, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 403;
        throw next(error);
    }
}

module.exports = {
    hasError,
    validationError
}