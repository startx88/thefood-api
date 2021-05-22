const Recipe = require('../model/recipe');
const Auth = require("../model/auth");
const Restaurant = require('../model/restaurant');
const { hasError, validationError } = require('../middleware/validation');
const { noImage, filterFiles, deleteFile } = require('../utils');
const { isVendor } = require('../middleware/vendor')

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

// GET RECIPE
exports.getRecipe = async (req, res, next) => {
    const recipeId = req.params.recipeId;
    try {
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

        const { name, type, price, description, ingredients, note, offer, menu } = req.body;
        const image = req.file;
        let slug = name.replace(/\s+/, '-').toLowerCase();

        const recipe = new Recipe({
            restaurant: restaurant._id,
            name,
            slug,
            type,
            price,
            offer,
            menu,
            note,
            ingredients: ingredients,
            description,
            image: image ? image.path : "",
        });

        const result = await recipe.save();

        return res.status(201).json({
            message: "Recipe added successfully",
            data: result
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
        const { name, type, price, description, ingredients, note, offer, menu } = req.body;
        const image = req.file;
        let slug = name.replace(/\s+/, '-').toLowerCase();
        recipe.name = name;
        recipe.slug = slug;
        recipe.type = type;
        recipe.price = price;
        recipe.offer = offer;
        recipe.menu = menu;
        recipe.note = note;
        recipe.increment = ingredients;
        recipe.description = description;
        if (image) {
            deleteFile(recipe.image);
            recipe.image = image.path;
        }
        recipe.insertAt = Date.now();
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