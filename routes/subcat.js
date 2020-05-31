const Subcategory = require("../model/subcat");
const route = require('express').Router();
const multer = require('multer')
const subcatController = require('../controllers/subcat')
const { body } = require('express-validator')
const { filterFiles } = require('../utils/file');

// UPLOAD CATEGORY IMAGE
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/subcat');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    }), fileFilter: filterFiles
})

//@NAME         subcategory
//@URL          localhost:5000/api/subcat
//@METHOD       GET
//@ACCESS       PUBLIC
route.get('/', subcatController.getSubCategories)

//@NAME         add category
//@URL          localhost:5000/api/category
//@METHOD       POST
//@ACCESS       PRIVATE
route.post('/:subcatId?', upload.single('image'), [
    body("name", "name is required!").notEmpty(),
    body("description", "description is required!").notEmpty(),
    // body("category", "category is required!").notEmpty()
], subcatController.addUpdateSubCategory);

//@NAME         image upload
//@URL          localhost:5000/api/category/upload/:userId
//@METHOD       PUT
//@ACCESS       PRIVATE
route.put('/upload/:subcatId', upload.single('image'), subcatController.uploadsubCategoryImage);

//@NAME         active category
//@URL          localhost:5000/api/category/activate/:categoryId
//@METHOD       POST
//@ACCESS       PRIVATE

route.put('/activate/:subcatId', subcatController.activesubCategory);

//@NAME         deactive category
//@URL          localhost:5000/api/category/deactivate/:categoryId
//@METHOD       POST
//@ACCESS       PRIVATE
route.put('/deactivate/:subcatId', subcatController.deactivatesubCategory);

//@NAME         delete category
//@URL          localhost:5000/api/category/activate/:categoryId
//@METHOD       POST
//@ACCESS       PRIVATE

route.delete('/:subcatId', subcatController.deleteSubcategory);


module.exports = route;
