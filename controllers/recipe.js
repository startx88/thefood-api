const Recipe = require('../model/recipe');
const { validationResult } = require('express-validator');
const { deleteFile } = require('../utils/file')

// GET ALL RECIPES
exports.getRecipes = async (req, res, next) => {
    const page = +req.query.page || 1;
    const PER_PAGE = 5;
    try {

        const total = await Recipe.find().countDocuments();
        const recipes = await Recipe.find().select("-__v");
        if (!recipes) {
            return res.status(404).json({
                errors: {
                    message: "There is no recipes",
                    status: 404
                }
            })
        }
        return req.res.json({
            totals: total,
            next: page + 1,
            prev: page - 1,
            pages: Math.floor(total / PER_PAGE),
            data: recipes.map(recipe => ({
                ...recipe._doc,
                image: 'http://localhost:5000/' + recipe.image
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
                image: 'http://localhost:5000/' + recipe.image
            }
        })
    } catch (error) {
        next(error)
    }
}

// ADD RECIPE
exports.addRecipe = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 403;
            throw next(error)
        }

        const { name, description, ingredients } = req.body;
        const image = req.file;
        console.log(req.file)

        let slug = req.body.slug;
        if (slug === "") {
            slug = name.replace(/\s+/, '-').toLowerCase()
        }

        // if (!image) {
        //     const error = new Error("Please upload file in these formats (JPG|JPEG|PNG|GIF|JIFF)");
        //     error.statusCode = 400;
        //     throw next(error)
        // }

        const recipe = new Recipe({
            name,
            slug,
            description,
            ingredients
        })

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
    const recipeId = req.params.recipeId;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 403;
            throw next(error)
        }

        const recipe = await Recipe.findById(recipeId).select("-__v");
        // not match with any id
        if (!recipe) {
            const error = new Error("No recipe found");
            error.statusCode = 404;
            throw next(error)
        }

        const { name, description, ingredients } = req.body;
        const image = req.file;

        let slug = req.body.slug;
        if (slug === "") {
            slug = name.replace(/\s+/, '-').toLowerCase()
        }

        recipe.name = name;
        recipe.slug = slug;
        recipe.description = description;
        if (image) {
            deleteFile(recipe.image);
            recipe.image = image.path;
        }
        recipe.insertAt = Date.now()
        const result = await recipe.save();
        return res.status(201).json({
            message: "Recipe updated successfully",
            data: {
                ...result._doc,
                image: 'http://localhost:5000/' + result.image
            }
        });

    } catch (error) {
        next(error)
    }
}

// GET RECIPE
exports.deleteRecipe = async (req, res, next) => {
    const recipeId = req.params.recipeId;
    try {
        const recipe = await Recipe.findById(recipeId).select("-__v");
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
    const recipeId = req.params.recipeId;
    try {
        const recipe = await Recipe.findById(recipeId).select("-__v");
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