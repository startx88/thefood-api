const Category = require("../model/category");
const route = require('express').Router();
const multer = require('multer')
const categoryController = require('../controllers/category')
const { body } = require('express-validator')
const { filterFiles } = require('../utils/file');
const { auth } = require('../middleware/auth');

// UPLOAD CATEGORY IMAGE
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/category');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    }), fileFilter: filterFiles
})

//@NAME         category
//@URL          localhost:5000/api/category
//@METHOD       GET
//@ACCESS       PUBLIC
route.get('/', categoryController.getCategories)

//@NAME         add category
//@URL          localhost:5000/api/category
//@METHOD       POST
//@ACCESS       PRIVATE
route.post('/:categoryId?', upload.single('image'), [
    body("name", "name is required!").notEmpty(),
    body("description", "description is required!").notEmpty()
], auth, categoryController.addUpdateCategory);

//@NAME         image upload
//@URL          localhost:5000/api/category/upload/:userId
//@METHOD       PUT
//@ACCESS       PRIVATE
route.put('/upload/:categoryId',
    upload.single('image'),
    auth,
    categoryController.uploadCategoryImage);

//@NAME         active category
//@URL          localhost:5000/api/category/activate/:categoryId
//@METHOD       POST
//@ACCESS       PRIVATE

route.put('/activate/:categoryId', auth, categoryController.activeCategory);

//@NAME         deactive category
//@URL          localhost:5000/api/category/deactivate/:categoryId
//@METHOD       POST
//@ACCESS       PRIVATE
route.put('/deactivate/:categoryId', auth, categoryController.deactivateCategory);

//@NAME         delete category
//@URL          localhost:5000/api/category/activate/:categoryId
//@METHOD       POST
//@ACCESS       PRIVATE

route.delete('/:categoryId', auth, categoryController.deleteCategory);


module.exports = route;
