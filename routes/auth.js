const route = require('express').Router();
const { userRegister, userLogin, getUsers, userForgotPassword, userVerifyEmail } = require('../controllers/auth')
const { signupSchema, signinSchema } = require('./schema')
const { auth } = require('../middleware/auth');

route.get('/users', auth, getUsers);
// register user
route.post('/signup', signupSchema, userRegister);
// login user
route.post('/', signinSchema, userLogin);
// forgot password
// verify email


module.exports = route;