const { body, oneOf } = require("express-validator");
const Auth = require("../model/auth");
const { regExp } = require("../utils");

// signup schema
exports.signupSchema = [
  body("firstname", "firstname is required!").notEmpty(),
  body("lastname", "lastname is required!").notEmpty(),
  body("email", "email is required")
    .isEmail()
    .custom(async (email) => {
      const auth = await Auth.findOne({ email });
      if (auth) {
        throw new Error("Email already existed!");
      }
      return auth;
    }),
  body("password", "password is required!")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8 to 16 char long")
    .matches()
    .withMessage(
      "Password must be one uppercase, one lowercase, one digit and one symbol.",
    ),
  body("mobile", "mobile is required!")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile is not valid, Please enter valid mobile no.")
    .matches(regExp.mobile)
    .custom(async (mobile) => {
      const auth = await Auth.findOne({ mobile });
      if (auth) {
        throw new Error("Mobile already registered with us, please use your mobile no!");
      }
      return auth;
    }),
];

// signin schema
exports.signinSchema = [
  oneOf([
    body("email").isEmail().withMessage("Please use valid email address"),
    body("email").isMobilePhone("en-IN"),
  ]),
  body("password", "password is required!")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8 to 16 char long")
];

exports.forgotSchema = [
  oneOf([
    body("email").isEmail().withMessage("Please use valid email address"),
    body("email").isMobilePhone("en-IN"),
  ]),
];

exports.resetPasswordSchema = [
  body("password", "password is required!")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8 to 16 char long")
    .matches(regExp.password)
    .withMessage(
      "Password must be one uppercase, one lowercase, one digit and one symbol.",
    ),
];

exports.newPasswordSchema = [
  body("password", "password is required!")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8 to 16 char long")
    .matches(regExp.password)
    .withMessage(
      "Password must be one uppercase, one lowercase, one digit and one symbol.",
    ),
  body("confirm-password", "confirm-password is required")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8 to 16 char long")
    .matches(regExp.password)
    .custom(async (value, { req }) => {
      if (value !== req.body.password) {
        return Promise.reject("Confirm password not match with password");
      }
      return true;
    }),
];
