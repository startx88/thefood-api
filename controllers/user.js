const User = require('../model/user');
const { validationResult } = require('express-validator');
const { tryCatch } = require('../utils/tryCatch')
// GET USERS
exports.getUsers = (req, res, next) => {
    tryCatch(async () => { }, next)
}

// SIGNUP USER
exports.userSignup = (req, res, next) => {
    tryCatch(async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 403;
            throw next(error)
        }
        const { firstname, lastname, email, password, mobile } = req.body;

        const user = new User({
            firstname,
            lastname,
            email,
            password: await User.hashPassword(password),
            mobile
        })

        console.log(user)

    }, next)
}

// SIGN-IN USER
exports.userSignin = (req, res, next) => {
    tryCatch(async () => { }, next)
}

// UPLOAD USER AVATAR
exports.uploadAvatar = (req, res, next) => {
    const userId = req.params.userId;
    tryCatch(async () => { }, next)
}

// UPLOAD VIDEOS
exports.uploadVideo = (req, res, next) => {
    const userId = req.params.userId;
    tryCatch(async () => { }, next)
}

// ACTIVE USER
exports.activeUser = (req, res, next) => {
    const userId = req.params.userId;
    tryCatch(async () => { }, next)
}
// DEACTIVE USER
exports.deactiveUser = (req, res, next) => {
    const userId = req.params.userId;
    tryCatch(async () => { }, next)
}
