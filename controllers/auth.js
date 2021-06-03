const Auth = require('../model/auth')
const { validationResult } = require('express-validator')
const { getTime, noImage } = require('../utils');
const { isAdmin } = require('../middleware/admin');

/**
 * get all users
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.getUsers = async function (req, res, next) {
  try {
    await isAdmin(req.user.userId, next);
    const filters = req.query;
    const users = await Auth.find();
    const filterdData = users.filter((data) => {
      let isValid = true;
      for (key in filters) {
        isValid = isValid && data[key] == filters[key];
      }
      return isValid;
    });
    for (let i in filterdData) {
      filterdData[i].image = noImage('uploads/users/', filterdData[i].image);
    }
    return res.status(200).send(filterdData)

  } catch (err) {
    next(err)
  }
}

// register 
exports.userRegister = async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 403;
      throw next(error)
    }
    const { firstname, lastname, email, password, mobile, role } = req.body;
    const authUser = new Auth({
      firstname,
      lastname,
      email,
      password: await Auth.hashPassword(password),
      mobile,
      role: role
    });

    const token = await Auth.generateToken(authUser);
    authUser.token = token;
    authUser.tokenExpire = getTime(1);
    const result = await authUser.save();
    // send user data
    return res.status(201).json({
      message: "User reigstered successfully!",
      token: token,
      data: result,
      expireIn: 3600
    })

  } catch (error) {
    next(error);
  }
}

// login
exports.userLogin = async function (req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 403;
      throw next(error)
    }

    const { email, password } = req.body;
    const auth = await Auth.findOne({ $or: [{ email: email }, { mobile: email }] });

    if (!auth) {
      const error = new Error("User is not exited.");
      error.statusCode = 401;
      throw next(error)
    }

    const verify = await Auth.comparePassword(password, auth.password);
    if (!verify) {
      const error = new Error("Password not matched!");
      error.statusCode = 401;
      throw next(error)
    }
    const token = await Auth.generateToken(auth);
    auth.token = token;
    auth.tokenExpire = getTime(1);
    await auth.save();

    // send user data
    return res.status(201).send({
      message: "User signin successfully!",
      token: token,
      data: auth,
      expireIn: 3600
    })
  } catch (error) {
    next(error);
  }
}
// forgot password
exports.userForgotPassword = function (req, res, next) {
  try {

  } catch (error) {
    next(error);
  }
}
// verify email
exports.userVerifyEmail = function (req, res, next) {
  try {

  } catch (error) {
    next(error);
  }
}