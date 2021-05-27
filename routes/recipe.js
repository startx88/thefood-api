const route = require('express').Router();
const Recipe = require('../model/recipe')
const { getRecipe, getRecipes, addRecipe, updateRecipe, deleteRecipe, activeRecipe, deactiveRecipe, uploadImage, getRecipeByMenu, getRecipeByRestaurant } = require('../controllers/recipe');
const multer = require("multer");
const { body } = require('express-validator');
const { filterFiles } = require('../utils/file');
const { auth } = require('../middleware/auth')

// MULTER
const storages = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/recipes');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storages, fileFilter: filterFiles })


// All recipes
route.get("/", getRecipes);
route.get("/:recipeId", getRecipe);
route.get('/:menuId', auth, getRecipeByMenu);
route.get('/:restaurantId', auth, getRecipeByRestaurant);

// Add Recipe
route.post("/", auth, upload.single("image"), [
    body("name", "name is required!").not().isEmpty(),
    body("type", "type is required!").not().isEmpty(),
    body("price", "price is required!").not().isEmpty(),
    body("menu", "menu is required!").not().isEmpty(),
], addRecipe);

// Update Recipe
route.put("/:recipeId",
    upload.single("image"),
    body("name", "name is required!").not().isEmpty(),
    body("recipeType", "recipeType is required!").not().isEmpty(),
    body("price", "price is required!").not().isEmpty(),
    body("menu", "menu is required!").not().isEmpty(),
    auth,
    updateRecipe);

route.delete("/:recipeId", auth, deleteRecipe);
// Active and Deactive
route.put("/activate/:recipeId", auth, activeRecipe);
route.put("/deactivate/:recipeId", auth, deactiveRecipe);
route.put("/upload/:recipeId", auth, upload.single("image"), uploadImage);

module.exports = route;