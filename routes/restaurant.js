const route = require('express').Router();
const multer = require('multer')
const {
    getAllRestaurants,
    getRestaurant,
    addRestaurantBanner,
    getMyRestaurant,
    addUpdateRestaurant,
    openCloseRestaurant,
    activeDeactiveRestaurant
} = require('../controllers/restaurant')
const { body } = require('express-validator')
const { filterFiles } = require('../utils/file');
const { auth } = require('../middleware/auth');
const { Permission } = require('../middleware/permission');

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

//@NAME         Restaurant vendor detail
//@URL          localhost:5000/api/restaurant/me
//@METHOD       GET
//@ACCESS       PUBLIC
route.get('/me', auth, getMyRestaurant);
//@NAME         Restaurant detail
//@URL          localhost:5000/api/restaurant/:restaurantId
//@METHOD       GET
//@ACCESS       PUBLIC
route.get('/:id', getRestaurant);


//@NAME         Restaurant
//@URL          localhost:5000/api/restaurant/:id?
//@METHOD       GET
//@ACCESS       PUBLIC
route.post('/:id?', upload.single('image'), [
    body("name", "Restaurant name is required").notEmpty(),
    body("mobile", "Restaurant type is required").notEmpty(),
    body("yearOfBirth", "Year of establishment is required").notEmpty(),
], auth, addUpdateRestaurant);


//@NAME         Restaurant
//@URL          localhost:5000/api/restaurant/upload/:restaurantId
//@METHOD       GET
//@ACCESS       PUBLIC
route.post('/upload/:restarantId', upload.single('image'), auth, addRestaurantBanner);

//@NAME         Restaurant
//@URL          localhost:5000/api/restaurant/activate/:restaurantId
//@METHOD       GET
//@ACCESS       PUBLIC
route.put('/activate/:restarantId', auth, Permission, activeDeactiveRestaurant);

//@NAME     :   Restaurant
//@URL      :   localhost:5000/api/restaurant/activate/:restaurantId
//@METHOD   :   GET
//@ACCESS   :   PUBLIC
route.put('/deactivate/:restarantId', auth, Permission, activeDeactiveRestaurant);

//@NAME     :   Restaurant
//@URL      :   localhost:5000/api/restaurant/deactivate/:restaurantId
//@METHOD   :   GET
//@ACCESS   :   PUBLIC
route.put('/open/:restarantId', auth, Permission, openCloseRestaurant);

//@NAME     :   Restaurant
//@URL      :   localhost:5000/api/restaurant/close/:restaurantId
//@METHOD   :   GET
//@ACCESS   :   PUBLIC
route.put('/close/:restarantId', auth, Permission, openCloseRestaurant);

// export 
module.exports = route;
