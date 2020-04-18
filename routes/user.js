const User = require("../model/user");
const route = require('express').Router();
const userController = require('../controllers/user')
const { body } = require('express-validator')
const multer = require('multer')
const { filterFiles } = require('../utils/file');


const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/users');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    }), fileFilter: filterFiles
})

//@NAME         users
//@URL          localhost:5000/api/user
//@METHOD       GET
//@ACCESS       PRIVATE
route.get('/all', userController.getUsers)

//@NAME         signin
//@URL          localhost:5000/api/user
//@METHOD       POST
//@ACCESS       PUBLIC
route.post('/', [
    body("email", "email is required!").isEmail().custom((value, { req }) => {
        return User.findOne({ email: value })
            .then(user => {
                if (!user) {
                    return Promise.reject("Email not found!")
                }
                return true
            })
    }),
    body("password", "password is required!")
        .isAlphanumeric()
        .isLength({ min: 6, max: 15 })
        .withMessage("Password must be alphanumeric and min 6 to max 16 char long.")
], userController.userSignin);

//@NAME         signup
//@URL          localhost:5000/api/user/signup
//@METHOD       POST
//@ACCESS       PUBLIC
route.post('/signup', [
    body("firstname", "first name is required!").not().isEmpty(),
    body("lastname", "last name is required!").not().isEmpty(),
    body("email", "email is required!").isEmail().custom((value, { req }) => {
        return User.findOne({ email: value }).then(user => {
            if (user) {
                return Promise.reject("Email already existed!")
            }
            return true
        })
    }),
    body("password", "password is required!")
        .isAlphanumeric()
        .isLength({ min: 6, max: 15 })
        .withMessage("Password must be alphanumeric and min 6 to max 16 char long."),
    body("mobile", "mobile is required").not().isEmpty()
], userController.userSignup);

//@NAME         image upload
//@URL          localhost:5000/api/user/avatar/:userId
//@METHOD       PUT
//@ACCESS       PRIVATE
route.put('/upload/:userId', upload.single('image'), userController.uploadAvatar);

//@NAME         video upload
//@URL          localhost:5000/api/user/signup/upload
//@METHOD       POST
//@ACCESS       PUBLIC

route.post('/video/:userId', upload.single('video'), userController.uploadVideo);

//@NAME         
//@URL          localhost:5000/api/user/signup
//@METHOD       POST
//@ACCESS       PUBLIC

route.post('/activate/:userId', userController.activeUser);

//@NAME         deactivate
//@URL          localhost:5000/api/user/signup
//@METHOD       POST
//@ACCESS       PUBLIC

route.post('/deactivate/:userId', userController.deactiveUser);

module.exports = route;
