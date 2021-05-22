const route = require('express').Router();
const Restaurant = require("../model/restaurant");
const multer = require('multer')
const { getAllRestaurants, getRestaurant, addMenus, addRestaurantBanner, addUpdateRestaurant } = require('../controllers/restaurant')
const { body } = require('express-validator')
const { filterFiles } = require('../utils/file');
const { auth } = require('../middleware/auth');

// Upload Restaurant image
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/restaurants');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    }), fileFilter: filterFiles
})

//@NAME         Restaurant
//@URL          localhost:5000/api/restaurant
//@METHOD       GET
//@ACCESS       PUBLIC
route.get('/', getAllRestaurants);

//@NAME         Restaurant
//@URL          localhost:5000/api/restaurant
//@METHOD       GET
//@ACCESS       PUBLIC
route.get('/:id', getRestaurant)

//@NAME         Restaurant
//@URL          localhost:5000/api/restaurant/:id?
//@METHOD       GET
//@ACCESS       PUBLIC
route.post('/:id?', upload.single('image'), [
    body("name", "Restaurant name is required").notEmpty(),
    body("type", "Restaurant type is required").notEmpty(),
    body("mobile", "Restaurant mobile is required").notEmpty()
], auth, addUpdateRestaurant);


//@NAME         Restaurant
//@URL          localhost:5000/api/restaurant/upload/:restaurantId
//@METHOD       GET
//@ACCESS       PUBLIC
route.post('/upload/:restarantId', upload.single('image'), auth, addRestaurantBanner);

//@NAME         Restaurant
//@URL          localhost:5000/api/restaurant/upload/:restaurantId
//@METHOD       GET
//@ACCESS       PUBLIC
route.post('/menus/:restarantId/:menuId?', [
    body("title", "Restaurant title is required").notEmpty()
], auth, addMenus)


module.exports = route;
