const Auth = require("../model/auth");
const Recipe = require('../model/recipe');
const Restaurant = require('../model/restaurant');
const { hasError, validationError } = require('../middleware/validation');
const { noImage, deleteFile, hasNoImage } = require('../utils');
const { isVendor } = require('../middleware/vendor')
const { isAdmin } = require('../middleware/admin')

// GET ALL RECIPES
exports.getRecipes = async (req, res, next) => {
    try {
        const page = +req.query.page || 1;
        const limit = req.query.limit !== "undefined" ? +req.query.limit || 6 : 0;
        const total = await Recipe.find().countDocuments();
        const Recipes = await Recipe.find()
            .find()
            .sort({ title: 1 })
            .limit(limit)
            .skip((page - 1) * limit);
        return req.res.json({
            totals: total,
            next: page + 1,
            prev: page - 1,
            pages: Math.floor(total / limit),
            data: Recipes.map(recipe => ({
                ...recipe._doc,
                image: noImage('uploads/recipes/', recipe.image)
            }))
        })
    } catch (error) {
        next(error)
    }
}


/**
 * Get recipe by menu
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.getRecipeByMenu = async function (req, res, next) {
    try {
        const menuId = req.params.menuId;
        const recipe = Recipe.find({ menu: menuId });

        if (!recipe) {
            throw hasError(next);
        }
        return res.status(200).json({
            message: 'Recipes fetched',
            data: {
                ...recipe._doc,
                image: noImage('uploads/recipes/', recipe.image)
            }
        })
    } catch (err) { next(err) }
}

/**
 * Get recipe by menu
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.getRecipeByRestaurant = async function (req, res, next) {
    try {
        const restaurantId = req.params.restaurantId;
        const recipe = Recipe.find({ restaurant: restaurantId });

        if (!recipe) {
            throw hasError(next);
        }
        return res.status(200).json({
            message: 'Recipes fetched',
            data: {
                ...recipe._doc,
                image: noImage('uploads/recipes/', recipe.image)
            }
        })
    } catch (err) { next(err) }
}


// GET RECIPE
exports.getRecipe = async (req, res, next) => {
    try {
        const recipeId = req.params.recipeId;
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({
                errors: {
                    message: "There is no recipes",
                    status: 404
                }
            })
        }
        return res.status(200).json({
            message: "Recipe fetch",
            data: {
                ...recipe._doc,
                image: noImage('uploads/recipes/', recipe.image)
            }
        })
    } catch (error) {
        next(error)
    }
}

// ADD RECIPE
exports.addRecipe = async (req, res, next) => {
    try {
        await isVendor(req.user.userId, next);
        validationError(req);
        const userId = req.user.userId;
        const user = await Auth.findById(userId); // user profile
        const restaurant = await Restaurant.findOne({ user: userId }); // restaurant
        const { menu, name, recipeType, cuisineType, description, price, offer, note, ingredients } = req.body;
        const image = req.file;
        let slug = name.replace(/\s+/, '-').toLowerCase();

        const recipe = new Recipe({
            restaurant: restaurant._id,
            menu,
            name,
            slug,
            recipeType,
            cuisineType,
            price,
            offer,
            note,
            ingredients: ingredients,
            description,
            image: image ? image.path : ""
        });

        const result = await recipe.save();
        return res.status(201).json({
            message: "Recipe added successfully",
            data: {
                ...result._doc,
                image: noImage('uploads/recipes/', result.image)
            }
        });

    } catch (error) {
        next(error)
    }
}

// GET RECIPE
exports.updateRecipe = async (req, res, next) => {
    try {
        validationError(req, next);
        const recipeId = req.params.recipeId;
        const userId = req.user.userId;
        const restaurant = await Restaurant.findOne({ user: userId })
        const recipe = await Recipe.findOne({ _id: recipeId, restaurant: restaurant._id });
        // not match with any id
        if (!recipe) {
            const error = new Error("No recipe found");
            error.statusCode = 404;
            throw next(error)
        }
        const { menu, name, recipeType, cuisineType, description, price, offer, note, ingredients } = req.body;
        const image = req.file;
        let slug = name.replace(/\s+/, '-').toLowerCase();
        recipe.name = name;
        recipe.slug = slug;
        recipe.recipeType = recipeType;
        recipe.cuisineType = cuisineType;
        recipe.type = type;
        recipe.price = price;
        recipe.offer = offer;
        recipe.menu = menu;
        recipe.note = note;
        recipe.ingredients = ingredients;
        recipe.description = description;
        recipe.insertAt = Date.now();
        if (image) {
            deleteFile(recipe.image);
            recipe.image = image.path;
        }
        const result = await recipe.save();
        return res.status(201).json({
            message: "Recipe updated successfully",
            data: {
                ...result._doc,
                image: noImage('uploads/recipes/', recipe.image)
            }
        });

    } catch (error) {
        next(error)
    }
}

// GET RECIPE
exports.deleteRecipe = async (req, res, next) => {
    try {
        const recipeId = req.params.recipeId;
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            const error = new Error("No recipe found");
            error.statusCode = 404;
            throw next(error)
        }

        if (recipe) {
            deleteFile(recipe.image);
        }
        const result = await recipe.remove();
        return res.status(200).json({
            message: "Recipe deleted successfully!",
            data: recipe,
            recipeId: result._id
        })

    } catch (error) {
        next(error)
    }
}


// GET RECIPE
exports.activeRecipe = async (req, res, next) => {
    const recipeId = req.params.recipeId;
    try {
        const recipe = await Recipe.findById(recipeId).select("-__v");
        if (!recipe) {
            const error = new Error("No recipe found");
            error.statusCode = 404;
            throw next(error)
        }

        if (recipe.active) {
            return res.status(200).json({
                message: "Recipe already activated!",
                recipeId: recipe._id,
                data: recipe
            })
        }
        recipe.active = true;
        const result = await recipe.save();
        return res.status(200).json({
            message: "Recipe activated successfully",
            recipeId: result._id,
            data: result,
        })

    } catch (error) {
        next(error)
    }
}


// GET RECIPE
exports.deactiveRecipe = async (req, res, next) => {
    const recipeId = req.params.recipeId;
    try {
        const recipe = await Recipe.findById(recipeId).select("-__v");
        if (!recipe) {
            const error = new Error("No recipe found");
            error.statusCode = 404;
            throw next(error)
        }
        if (!recipe.active) {
            return res.status(200).json({
                message: "Recipe already deactivated!",
                recipeId: recipe._id,
                data: recipe,
            })
        }

        recipe.active = false;
        const result = await recipe.save();

        return res.status(200).json({
            message: "Recipe deactivated successfully",
            recipeId: result._id,
            data: result,
        })

    } catch (error) {
        next(error)
    }
}


// UPLOAD RECIPE IMAGE
exports.uploadImage = async (req, res, next) => {
    try {
        const recipeId = req.params.recipeId;
        const recipe = await Recipe.findById(recipeId);
        const image = req.file;

        if (!recipe) {
            const error = new Error("No recipe found");
            error.statusCode = 404;
            throw next(error)
        }

        if (!image) {
            const error = new Error("Please upload file in these formats (JPG|JPEG|PNG|GIF|JIFF)");
            error.statusCode = 400;
            throw next(error)
        }


        if (image) {
            deleteFile(recipe.image);
            recipe.image = image.path;
        }
        const result = await recipe.save();
        return res.status(200).json({
            message: "Image uploaded successfully",
            recipeId: result._id,
            data: result,
        })
    } catch (error) {
        next(error)
    }

}