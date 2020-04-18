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

        //const isuser = await User.findOne({ email: email })

        const user = new User({
            firstname,
            lastname,
            email,
            password: await User.hashPassword(password),
            mobile
        });

        const result = await user.save();

        const token = await User.generateToken(result);

        // send user data
        return res.status(201).json({
            message: "User reigstered successfully!",
            data: result,
            token: token
        })

    }, next)
}

// SIGN-IN USER
exports.userSignin = (req, res, next) => {
    tryCatch(async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 403;
            throw next(error)
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            const error = new Error("No user found");
            error.statusCode = 404;
            throw next(error)
        }

        const verify = await User.comparePassword(password, user.password);
        if (!verify) {
            const error = new Error("Password not match!");
            error.statusCode = 401;
            throw next(error)
        }

        const token = await User.generateToken(user);
        // send user data
        return res.status(201).json({
            message: "User authenticated successfully!",
            data: user,
            token: token
        })



    }, next)
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
