const route = require('express').Router();
const { userRegister, userLogin, userForgotPassword, userVerifyEmail } = require('../controllers/auth')
const { signupSchema, signinSchema } = require('./schema')

// register user
route.post('/signup', signupSchema, userRegister);
// login user
route.post('/', signinSchema, userLogin);
// forgot password

// verify email


module.exports = route;