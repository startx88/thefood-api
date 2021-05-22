const route = require('express').Router();
const Auth = require("../model/auth");
const { addUpdateAddress, getProfile, addUpdateAvatar, addUpdateProfile } = require('../controllers/profile')
const multer = require('multer')
const { body } = require('express-validator')
const { filterFiles } = require('../utils/file');
const { auth } = require('../middleware/auth');

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/users');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    }), fileFilter: filterFiles
});

//@NAME         users
//@URL          localhost:5000/api/user
//@METHOD       GET
//@ACCESS       PRIVATE
route.get('/me', auth, getProfile)

//@NAME         users
//@URL          localhost:5000/api/profile/
//@METHOD       GET
//@ACCESS       PRIVATE
route.post('/:profileId?', auth, addUpdateProfile);

//@NAME         users
//@URL          localhost:5000/api/profile/address
//@METHOD       GET
//@ACCESS       PRIVATE
route.post('/address/:userId?', [
    body("state", "state is required").notEmpty(),
    body("city", "city is required").notEmpty(),
    body("address", "address is required").notEmpty(),
    body("landmark", "landmark is required").notEmpty(),
    body("pincode", "Pincode is required").notEmpty(),
], auth, addUpdateAddress);


//@NAME         users
//@URL          localhost:5000/api/profile/upload/:userId
//@METHOD       POST
//@ACCESS       PRIVATE
route.post('/upload/:userId',
    upload.single('image'),
    auth,
    addUpdateAvatar)

module.exports = route;
