const route = require('express').Router();
const Recipe = require('../model/recipe')
const recipeController = require('../controllers/recipe');
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
route.get("/", recipeController.getRecipes);
route.get("/:recipeId", recipeController.getRecipe);

// Add Recipe
route.post("/", auth, upload.single("image"), [
    body("name", "name is required!").not().isEmpty(),
    body("description", "description is required!").not().isEmpty(),
    body("ingredients", "ingredients is required!").custom((values, { req }) => {
        if (req.body.name === "" && req.body.qty === 0 && this.body.unit === "") {
            return Promise.resolve(new Error("Please add ingredients."))
        }
        return true
    })
], recipeController.addRecipe);

// Update Recipe
route.put("/:recipeId", auth, recipeController.updateRecipe);
route.delete("/:recipeId", auth, recipeController.deleteRecipe);

// Active and Deactive
route.put("/activate/:recipeId", auth, recipeController.activeRecipe);
route.put("/deactivate/:recipeId", auth, recipeController.deactiveRecipe);

route.put("/:recipeId/upload", auth, upload.single("image"), recipeController.uploadImage);

module.exports = route;