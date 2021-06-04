const route = require('express').Router();
const multer = require('multer')
const { activeDeactiveCategory, getCategories, getCategoryByRestaurantId, addUpdateCategory, deleteCategory } = require('../controllers/category')
const { body } = require('express-validator')
const { filterFiles } = require('../utils/file');
const { auth } = require('../middleware/auth');
const { Permission } = require('../middleware/permission')

// UPLOAD CATEGORY IMAGE
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads/category'),
        filename: (req, file, cb) => cb(null, Date.now().toString() + '-' + file.originalname)
    }),
    fileFilter: filterFiles
});

//@NAME         category
//@URL          localhost:5000/api/category
//@METHOD       GET
//@ACCESS       PUBLIC
route.get('/', getCategories)

//@NAME         category
//@URL          localhost:5000/api/category
//@METHOD       GET
//@ACCESS       PUBLIC
route.get('/:restarantId', getCategoryByRestaurantId)

//@NAME         add category
//@URL          localhost:5000/api/category
//@METHOD       POST
//@ACCESS       PRIVATE
route.post('/:restaurantId/:categoryId?',
    upload.single('image'),
    [body("title", "Title is required!").notEmpty()],
    auth, Permission, addUpdateCategory);

//@NAME         active category
//@URL          localhost:5000/api/category/activate/:categoryId
//@METHOD       POST
//@ACCESS       PRIVATE

route.put('/:restaurantId/activate/:categoryId', auth, Permission, activeDeactiveCategory);

//@NAME         deactive category
//@URL          localhost:5000/api/category/deactivate/:categoryId
//@METHOD       POST
//@ACCESS       PRIVATE
route.put('/:restaurantId/deactivate/:categoryId', auth, Permission, activeDeactiveCategory);

//@NAME         delete category
//@URL          localhost:5000/api/category/activate/:categoryId
//@METHOD       POST
//@ACCESS       PRIVATE
route.delete('/:restaurantId/delete/:categoryId', auth, Permission, deleteCategory);



// exports
module.exports = route;

/**
 * Category:
 * Burger King:
 * 1. Paneer
 * 2. Chicken
 * 3. Mutton
 */