const { validationResult } = require('express-validator');
const { deleteFile } = require('../utils');
/**
 * Error handler
 * @param {*} message 
 * @param {*} statusCode 
 * @param {*} next 
 */
const hasError = (message = "Not Found", statusCode = 404, next) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw next(error);
}

/**
 * Validation Error
 * @param {*} req 
 * @param {*} next 
 */
const validationError = (req, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        deleteFile(req.file.path);
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 403;
        throw next(error);
    }
}

module.exports = {
    hasError,
    validationError
}