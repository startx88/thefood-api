const route = require('express').Router();
const Cuisine = require("../model/cuisine");
const { getCuisines, addUpdateCuisine, deleteCuisines } = require('../controllers/cuisine')
const multer = require('multer')
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


//@NAME         cuisine
//@URL          /api/cuisine
//@METHOD       GET
//@ACCESS       PUBLIC
route.get('/', auth, getCuisines);


//@NAME         cuisine
//@URL          /api/cuisine
//@METHOD       POST
//@ACCESS       PUBLIC
route.post('/:cuisineId?', upload.single('image'), [body("title", "title is required").notEmpty()], auth, addUpdateCuisine);

//@NAME         cuisine
//@URL          /api/cuisine
//@METHOD       POST
//@ACCESS       PUBLIC
route.delete('/:cuisineId', auth, deleteCuisines);


// export rotue
module.exports = route